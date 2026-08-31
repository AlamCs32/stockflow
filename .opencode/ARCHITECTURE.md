# Architecture — StockFlow

> System structure, module boundaries, request and data flow, extension points.
> Derived from the actual repository on Mon Aug 31 2026.

## Monorepo layout (pnpm workspaces)

```
stockflow/
├── apps/
│   ├── server/   # Fastify 4 REST API (@stockflow/server)
│   └── web/      # React 18 + Vite 5 SPA (@stockflow/web)
├── packages/
│   ├── config/   # Env config singleton (@stockflow/config)
│   ├── shared/   # Shared types/constants (@stockflow/shared)
│   └── eslint-config/  # Shared ESLint flat config
├── pnpm-workspace.yaml
└── package.json  # Root: format, lint, typecheck, build, dev
```

## Server layered structure

```
apps/server/src/
├── app.ts                # Fastify factory: type providers, global error handler
├── index.ts              # Entry point: dotenv, buildApp(), listen
├── configs/
│   ├── index.ts          # Re-exports @stockflow/config + AppConfig type
│   └── logger.ts         # Pino config: redaction, request IDs, transports
├── plugins/              # Fastify plugin registrations
│   ├── index.ts          # Ordered: helmet, cors, sensible, rate-limit, multipart, static, database, swagger
│   ├── cors.ts, helmet.ts, sensible.ts, rate-limit.ts, multipart.ts, static.ts, swagger.ts
│   └── database.ts       # Decorates app.db, onClose hook to destroy
├── routes/index.ts       # Registers all module route plugins
├── modules/<name>/       # One directory per resource (see Module pattern)
├── services/             # Cross-module domain services
│   ├── sku.service.ts    # SKU builder (VENDOR-CATEGORY-DESIGN-COST-COLOR-SIZE)
│   ├── pricing.service.ts# Margin calculator (sellingPrice - costPrice)
│   └── stock.service.ts  # Stock adjustment with business rules + transaction
├── repositories/         # TypeORM repository helpers + finder functions
├── entities/             # TypeORM entities + enums
├── database/
│   ├── data-source.ts    # AppDataSource (better-sqlite3, migrations)
│   └── migrations/       # Timestamped migration files
├── shared/
│   ├── errors.ts         # AppError hierarchy
│   └── openapi.ts        # autoSwaggerTransform utility
└── scripts/                    # TypeORM CLI wrapper + seed (app-level, NOT under src/)
    ├── typeorm-cli.mjs   # TypeORM CLI wrapper via tsx loader
    └── seed.ts           # Seed script
```

## Module pattern (standard for all resources)

Each resource lives in `apps/server/src/modules/<name>/` with exactly 4 files:

- **`<name>.routes.ts`** — schema-driven route registration using `app.<method>(path, { schema }, handler)`.
- **`<name>.controller.ts`** — Thin handlers: parse typed `FastifyRequest`, call service, `reply.send()` or `reply.code(201).send()`.
- **`<name>.service.ts`** — Business logic: validation, uniqueness checks, `AppDataSource.transaction(...)` for multi-writes, `AppError` throws.
- **`<name>.schema.ts`** — Zod schemas with `.meta({ description, examples })`, `.transform()` for normalization, type inference.

Exception: `health/` uses `health.types.ts` for a hand-written interface instead of Zod (minimal endpoint, no input).
Exception: `items/` defines its response schema inline in `item.routes.ts` instead of a separate `item.schema.ts` (inconsistency).

## Module registry

All modules are registered in order in `apps/server/src/routes/index.ts`:

1. `healthRoutes` → `GET /health`
2. `itemRoutes` → `GET /api/items`
3. `uploadRoutes` → `POST /api/upload`
4. `vendorRoutes` → `POST /api/vendors`
5. `designRoutes` → `POST /api/designs`
6. `variantRoutes` → `POST /api/variants`, `GET /api/variants/:id`, `POST /api/variants/:id/pricing`, `PATCH /api/variants/:id/stock`
7. `inventoryRoutes` → `GET /api/inventory`

## Request lifecycle

```
HTTP Request
  → Fastify (genReqId: x-request-id or UUID)
  → helmet → cors → sensible → rate-limit (100/min) → multipart (5MB/5 files) → static
  → Zod validation (route schema)
  → Controller handler
    → Service (business logic, AppDataSource.transaction for multi-writes)
      → Repository / TypeORM manager
        → better-sqlite3
    → AppError subclasses mapped to status codes
  → Global error handler (app.ts setErrorHandler)
    → JSON envelope: { statusCode, error, message, details? }
  → Response serialized by Zod schema (fastify-type-provider-zod)
  → Pino logger (request ID, method, url, statusCode, responseTime)
```

## Domain model

```
Vendor (V001 text PK) ─┐
                       ├──→ Design (designCode D001, patternCode) ──→ ProductVariant (SKU) ──→ ChannelPricing (per sales channel)
Category (code ELE/KRT)─┘                                                  │
                                                                           └→ StockLog (INWARD/SALE/RETURN/ADJUSTMENT)
Item (legacy, User → Item → Category)
User (admin@example.com seeded, plaintext password — no auth)
```

- **SKU format**: `VENDOR-CATEGORY-DESIGN-COST-COLOR-SIZE` (e.g., `V001-KRT-D001-130-BLK-XL`)
- **Margin**: `sellingPrice - costPrice`, rounded to 2 decimals
- **Stock status**: `OUT_OF_STOCK` (≤0), `LOW_STOCK` (≤5 threshold), `IN_STOCK` (>5)
- **SalesChannel**: `MEESHO`, `FLIPKART`, `AMAZON`
- **StockLogReason**: `INWARD`, `SALE`, `RETURN`, `ADJUSTMENT`
- **VariantStatus**: `ACTIVE`, `INACTIVE`

## Data flow — create variant (key transaction flow)

```
POST /api/variants
  → createVariantSchema validates input
  → postVariantHandler
    → createVariant(input)
      → Find Design (with vendor + category relations)
      → buildSku() → VENDOR-CATEGORY-DESIGN-COST-COLOR-SIZE
      → Check SKU uniqueness (ConflictError if exists)
      → AppDataSource.transaction(manager)
        → manager.save(ProductVariant, { sku, ..., designId, stockQuantity: initialStock })
        → If initialStock > 0: manager.save(StockLog, { variantId, quantityChange: initialStock, reason: INWARD })
      → Return variant
```

## Data flow — adjust stock (transaction with business rules)

```
PATCH /api/variants/:id/stock  (security: [{ bearerAuth: [] }] — documentation only)
  → adjustStockSchema validates input
  → patchStockHandler
    → adjustStock(variantId, input)
      → assertReasonSign(reason, quantityChange)
        → INWARD/RETURN require positive; SALE requires negative; ADJUSTMENT any non-zero
      → AppDataSource.transaction(manager)
        → Find variant (NotFoundError if missing)
        → nextQuantity = stockQuantity + quantityChange
        → BusinessRuleError if nextQuantity < 0
        → manager.save(ProductVariant, { stockQuantity: nextQuantity })
        → manager.save(StockLog, { variantId, quantityChange, reason, channel })
      → Return { variant, log }
```

## Frontend architecture

- Single-page React 18 app (`App.tsx`) with `useState` + `useEffect`.
- Fetches `GET /api/items` on mount via `fetch` (no HTTP client library).
- Vite dev proxy: `/api` → `http://localhost:3000`.
- Uses `@stockflow/shared` types (`Item`, `APP_NAME`).
- No router, no state management library, no CSS framework.
- `main.tsx` renders `<App />` under `<React.StrictMode>`.
- Alias `@` → `./src`.

## Extension points

- **New resource**: add `apps/server/src/modules/<name>/` with 4 files + register in `routes/index.ts`.
- **New entity**: add `apps/server/src/entities/<name>.entity.ts` + add to `AppDataSource.entities` in `data-source.ts` + create migration.
- **New shared type**: add to `packages/shared/src/index.ts` (currently `Item`, `ApiResponse<T>`, `APP_NAME`, `API_PREFIX`).
- **New config value**: add to `packages/config/src/index.ts` under the `config` object + reference via `config.<section>.<key>` + document in `.env.example`.
- **New plugin**: add `apps/server/src/plugins/<name>.ts` + register in `plugins/index.ts`.
- **New Swagger tag**: add to `swagger.ts` tags array.

## Known inconsistencies (do not propagate)

- `design.service.ts` duplicates `createDesign` logic that already exists in `design.repository.ts`.
- `variant.service.ts` and others use `AppDataSource.getRepository()` directly instead of the `repositories/` layer (which has unused helpers like `findVariantById`).
- `items/` module defines its schema inline in `item.routes.ts` rather than in a separate `item.schema.ts`.
- `health/` module uses a hand-written interface (`health.types.ts`) instead of Zod.
- `upload/` controller imports `uploadsDir` from `@/plugins/static` (layer crossing).
- `cors.ts` methods list omits `PATCH`, but `PATCH /api/variants/:id/stock` exists.

## Performance characteristics

- SQLite (better-sqlite3) — single-file, no network DB.
- In-memory channel filter in `inventory.service.ts` — acceptable for current data volumes, not scalable.
- Pino async logging with rotating file transport (gzip, 14 files max, 10MB/file).
- Rate limit: 100 req/min global.
- Multipart: 5MB/file, 5 files max.
