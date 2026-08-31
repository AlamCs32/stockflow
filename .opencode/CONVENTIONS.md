# Conventions — StockFlow

> File/folder/naming patterns derived from the existing codebase.
> Every convention below is observed in the repository.

## Folder structure conventions

### Monorepo root

- `apps/` — applications
- `packages/` — shared libraries
- `pnpm-workspace.yaml` — workspace definition (`apps/*`, `packages/*`)
- `tsconfig.base.json` — shared TypeScript config
- `.prettierrc.json` — Prettier config (single source of truth)
- `.prettierignore`, `.gitignore` — ignore patterns
- `pnpm-lock.yaml` — lockfile

### Each app/package workspace

```
<name>/
├── package.json        # name, version, scripts, deps
├── tsconfig.json       # extends ../../tsconfig.base.json
└── src/                # source code (or only src/)
```

- `package.json`: `"type": "module"` in every workspace.
- `tsconfig.json`: always `extends: "../../tsconfig.base.json"`, sets `outDir: "dist"`, `rootDir: "src"`, `paths: { "@/*": ["./src/*"] }`.
- `package.json` scripts: `build`, `typecheck`, `clean`, and app-specific scripts (dev, lint, db:*).

### Server module layout (strict)

Each resource in `apps/server/src/modules/<name>/` uses exactly 4 files:

```
modules/<name>/
├── <name>.routes.ts    # route registration with schema
├── <name>.controller.ts# thin request handlers
├── <name>.service.ts   # business logic
└── <name>.schema.ts    # Zod schemas + type inference
```

Exceptions (documented in ARCHITECTURE.md): `health/` uses `.types.ts`, `items/` has inline schema in routes file.

### Naming conventions

#### Files (kebab-case)

- Entities: `product-variant.entity.ts` (kebab-case file, PascalCase class)
- Modules: `design.routes.ts`, `design.controller.ts`, `design.service.ts`, `design.schema.ts`
- Repositories: `<entity>.repository.ts`
- Configs: `data-source.ts`, `logger.ts`, `index.ts`
- Shared: `errors.ts`, `openapi.ts`
- Migrations: `<timestamp>-<Name>.ts` (e.g., `1785583091128-InitialSchema.ts`)
- Enums: defined inside `<entity>.entity.ts` (e.g., `SalesChannel`, `StockLogReason`, `VariantStatus`)

#### Classes / functions / handlers (PascalCase)

- Entity classes: `ProductVariant`, `ChannelPricing`, `StockLog`, `Design`, `Category`, `Vendor`, `Item`, `User`
- Enum values: `MEESHO`, `FLIPKART`, `AMAZON`, `INWARD`, `SALE`, `RETURN`, `ADJUSTMENT`, `ACTIVE`, `INACTIVE`
- Route handler functions: `postDesignHandler`, `getVariantHandler`, `patchStockHandler`, `postPricingHandler`, `postVendorHandler`, `getItemsHandler`, `getInventoryHandler`, `uploadFileHandler`, `getHealthHandler`
- Service functions: `createVariant`, `upsertPricing`, `adjustStock`, `getVariantOrThrow`, `createDesign`, `createVendor`, `listItems`, `listInventory`
- Repository functions: `findCategoryById`, `findDesignByCode`, `findAllItems`, `findVariantById`, `findVariantBySku`, `findPricing`
- Schema exports: `createDesignSchema`, `designResponseSchema`, `createDesignResponseSchema`, `variantIdParamSchema`, `upsertPricingSchema`, `adjustStockSchema`, `inventoryQuerySchema`, `inventoryResponseSchema`

#### Types (PascalCase, inferred from Zod)

- `CreateDesignInput`, `VariantIdParam`, `UpsertPricingInput`, `AdjustStockInput`, `CreateVariantInput`, `CreateVendorInput`, `InventoryQuery`
- `StockAdjustment` interface in `stock.service.ts`
- `SkuComponents` interface in `sku.service.ts`
- `InventoryItem`, `StockStatus` in `inventory.service.ts`
- `HealthResponse` in `health.types.ts`
- `ApiResponse<T>` in `packages/shared`

## Schema conventions (Zod)

- Import from `zod` directly in `<module>.schema.ts`.
- Use `.meta({ description, examples })` on every field for Swagger docs.
- Use `.transform()` for normalization (e.g., `.toUpperCase()`).
- Use `.coerce.number()` / `.coerce.int()` for numeric coercion.
- Use `.optional()`, `.nullable()`, `.default()` as needed.
- Response schemas use `z.object({ entity: ... })` wrapper (e.g., `{ design: designResponseSchema }`).
- Array fields use `z.array(...)`.
- Enum fields use `z.enum(SomeEnum)` or `z.enum(['VALUE1', 'VALUE2'])` for inline enums.
- Export type via `export type <Name>Input = z.infer<typeof schema>`.

## Route conventions

- All routes prefixed with `/api/<resource>` (except `/health` and `/docs*`).
- Route schema object shape: `{ schema: { tags, summary, description, body, response, params?, querystring?, consumes?, security? } }`.
- `tags` auto-derived from URL segment via `autoSwaggerTransform` unless explicitly provided.
- `operationId` auto-derived from method+path unless explicitly provided.
- Standard error responses (400, 404, 500) added automatically via `autoSwaggerTransform`.
- Security: only `PATCH /api/variants/:id/stock` declares `security: [{ bearerAuth: [] }]` — but no auth middleware enforces it.
- CORS methods list: `['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']` (note: PATCH missing — do not add PATCH without updating cors.ts).

## Response shape conventions

- Lists: `{ items: T[], count: number }` (inventory) or `{ items: T[] }` (items).
- Singletons: `{ variant }`, `{ design }`, `{ vendor }`, `{ pricing }`, `{ log }`.
- Combined: `{ variant, stockLog }`, `{ variant, pricings }`.

## Config conventions (`@stockflow/config`)

- Single exported `config` object (frozen via `as const`).
- `AppConfig` type exported as `typeof config`.
- Structure: `server`, `cors`, `uploads`, `database`, `inventory`, `swagger`, `logger`.
- Every env var has a sensible default.
- Access via `config.<section>.<key>` everywhere.
- Document all keys in `.env.example`.

## Logger conventions

- `buildLoggerConfig()` returns Fastify server logger options.
- `genRequestId(req)` returns `x-request-id` header or `randomUUID()`.
- Redaction paths built from config: `req.headers["authorization"]`, `req.body.password`, etc.
- `serializers.req` captures: method, url, hostname, remoteAddress, remotePort, headers.
- `serializers.res` captures: statusCode, responseTime.
- `serializers.err` omits stack in production.
- Transport: console (pretty in dev) + rotating file (combined + error).

## Entity conventions (TypeORM)

- File: `<name>.entity.ts`.
- Class: PascalCase matching entity name (e.g., `ProductVariant`).
- `@Entity('snake_case_table_name')` explicit table name.
- `@PrimaryGeneratedColumn()` for auto-increment integer PK.
- `@PrimaryColumn()` for string PK (e.g., `Vendor.id`).
- `@Column({ type: 'text', name: 'snake_case' })` for every property.
- `@ManyToOne`, `@OneToMany`, `@JoinColumn({ name: 'fk_id' })` for relations.
- Enums in-file as `export enum <Name> { ... }`.
- `@CreateDateColumn`, `@UpdateDateColumn` for timestamps.
- `relations: { ... }` eager loading in queries, not eager-relation decorator.

## Import conventions

- Workspace packages: `@stockflow/shared`, `@stockflow/config`, `@stockflow/eslint-config`.
- Internal aliases: `@/app`, `@/configs/index`, `@/entities/<entity>`, `@/modules/<name>/<name>.service`, `@/repositories/<repo>`, `@/shared/errors`, `@/database/data-source`, `@/plugins/<plugin>`, `@/services/<service>`, `@/shared/openapi`.
- Barrel re-exports: `configs/index.ts`, `plugins/index.ts`, `routes/index.ts`.
- No circular imports (verified by Graphify).
- Entity files import from other entities only (never from modules/services).

## Commit message convention

- `feat:` new features
- `fix:` bug fixes
- `chore:` maintenance, tooling, config
- `docs:` documentation
- `refactor:` restructuring without behavior change
- Format observed in git history: `feat: add ...`, `chore: ...`, `fix: ...`.

## File locations reference (quick lookup)

| Concern                     | Location                                     |
| --------------------------- | -------------------------------------------- |
| Config singleton            | `packages/config/src/index.ts`               |
| Shared types                | `packages/shared/src/index.ts`               |
| App entry                   | `apps/server/src/index.ts`                   |
| App factory + error handler | `apps/server/src/app.ts`                     |
| Plugin registrations        | `apps/server/src/plugins/index.ts`           |
| Route registrations         | `apps/server/src/routes/index.ts`            |
| Global error handler        | `apps/server/src/app.ts` `setErrorHandler`   |
| TypeORM data source         | `apps/server/src/database/data-source.ts`    |
| Migrations                  | `apps/server/src/database/migrations/`       |
| Entities                    | `apps/server/src/entities/`                  |
| Repositories                | `apps/server/src/repositories/`              |
| Shared errors               | `apps/server/src/shared/errors.ts`           |
| Swagger transform           | `apps/server/src/shared/openapi.ts`          |
| Logger config               | `apps/server/src/configs/logger.ts`          |
| Scripts (TypeORM CLI, seed) | `apps/server/scripts/`                       |
| Web app                     | `apps/web/src/` (App.tsx, main.tsx)          |
| ESLint config               | `packages/eslint-config/base.js`, `react.js` |
| Prettier config             | `.prettierrc.json`                           |
