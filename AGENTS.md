# AGENTS.md — StockFlow

## Project overview

Multi-channel e-commerce inventory management monorepo. Indian e-commerce context (Meesho, Flipkart, Amazon) with apparel design → product-variant → channel-pricing → stock-log domain.

## Architecture summary

- `apps/server` — Fastify 4 REST API, TypeORM + PostgreSQL, Zod validation, Pino logging
- `apps/web` — React 18 + Vite 5 SPA (minimal scaffold, fetches `/api/items`)
- `packages/shared` — shared types/constants (`Item`, `ApiResponse`, `APP_NAME`, `API_PREFIX`)
- `packages/config` — env config singleton (`@stockflow/config`)
- `packages/eslint-config` — shared ESLint flat config (base + react)
- All workspaces use ESM (`"type": "module"`), TypeScript strict, `@/*` path alias

## Stack

- Node 24, pnpm 11.9, TypeScript 5.4 strict, ESM everywhere
- Fastify 4 + fastify-type-provider-zod (zod 4.4.3)
- TypeORM 1.1 + PostgreSQL
- Pino 10 + pino-pretty + rotating-file-stream
- @fastify/{cors, helmet, multipart, rate-limit, sensible, static, swagger, swagger-ui, jwt}
- React 18 + Vite 5
- Prettier 3.9, ESLint 10 (flat config) + typescript-eslint 8

## Coding rules

- **Prettier** (singleQuote, semi, trailingComma es5, printWidth 100, tabWidth 2, arrowParens always, endOfLine auto) — run `pnpm format` before commits
- **ESLint**: root config via `@stockflow/eslint-config`; web adds react hooks plugin
- **No `any`** unless absolutely necessary
- **Errors** use `AppError` hierarchy: `NotFoundError(404)`, `ConflictError(409)`, `BusinessRuleError(422)`
- **Zod schemas** drive all request validation + response serialization (fastify-type-provider-zod)
- **Transactions** for multi-write consistency via `AppDataSource.transaction(...)`

## Implementation workflow

1. Add module under `apps/server/src/modules/<name>/` with `<name>.routes.ts`, `<name>.controller.ts`, `<name>.service.ts`, `<name>.schema.ts`
2. Add repository under `apps/server/src/repositories/<entity-name>.repository.ts` with finder/mutation functions
3. Register routes in `apps/server/src/routes/index.ts`
4. Re-export config through `apps/server/src/configs/index.ts` (`@stockflow/config`)
5. Add entities in `apps/server/src/entities/`, create migration via `pnpm --filter @stockflow/server db:migrate:generate`
6. Import shared via workspace protocol `@stockflow/shared` or `@stockflow/config`
7. Run `pnpm build && pnpm typecheck && pnpm lint && pnpm format`

## Frontend rules

- React 18 functional components with hooks
- Use `@stockflow/shared` types (`Item`, `APP_NAME`, `API_PREFIX`)
- Fetch data via `fetch` directly; Vite proxies `/api` → `http://localhost:3000`
- TypeScript strict; alias `@` → `./src`
- No router/state library yet; keep components minimal

## Backend rules

- Thin controllers, business logic in services, data access via repositories
- **No direct `AppDataSource.getRepository()` in services** — always use the repository layer
- Route files: schema-driven with `schema: { tags, summary, description, body, response }` per route
- Services throw `AppError` subclasses; global handler maps to JSON envelope `{ statusCode, error, message, details? }`
- All routes `/api/<resource>` except `/health` and `/docs*`
- Use `fastify-type-provider-zod` types: `FastifyRequest<{ Body: X }>`, `FastifyRequest<{ Params: X }>`, `FastifyRequest<{ Querystring: X }>`

## API rules

- Zod schemas in `<module>.schema.ts`; types inferred via `z.infer<typeof schema>`
- Auto Swagger at `/docs` via `autoSwaggerTransform` (auto tags from URL, operationId from method+path, standard 400/404/500 responses)
- Response shapes: lists `{ items: T[], count: number }`, singletons `{ entity }`
- Only the stock-adjust endpoint (`PATCH /api/variants/:id/stock`) has `security: [{ bearerAuth: [] }]` — but **no auth middleware is implemented** (placeholder only)

## Database rules

- PostgreSQL via `pg`; connection configured in `@stockflow/config` (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`)
- Migrations under `apps/server/src/database/migrations/` named `<timestamp>-<Name>.ts`
- Entity files: `<name>.entity.ts`; snake_case columns, camelCase props, explicit `@Column({ name: ... })`
- `synchronize: false` by default; use `db:migrate` / `db:migrate:generate` / `db:migrate:revert`
- AppDataSource initialized once, decorated on `app.db`, destroyed on close
- Never commit `.env` or `data/`

## Testing rules

- **No tests exist yet** — `apps/server/tests/` is empty, no test framework installed
- When adding tests: prefer Vitest (aligned with Vite/web) or Jest; place in `apps/server/tests/` and `apps/web/tests/`
- Test services independently; mock repository functions for unit tests

## Error handling

- `AppError` (base, statusCode + details) → `NotFoundError`, `ConflictError`, `BusinessRuleError`
- Global error handler in `app.ts`: maps `AppError` → status code, `ZodError` → 400 ValidationError, fastify validation errors → 400, fallback → 500 `"Internal server error"` (message hidden for >=500)
- Business rules: `BusinessRuleError` for stock/quantity/channel constraints; `ConflictError` for uniqueness

## Security rules

- **No authentication/authorization implemented** — `bearerAuth` is documentation-only in OpenAPI; User entity exists with plaintext seed password
- Never store passwords plaintext; add bcrypt/hash before auth implementation
- Add proper `preHandler` auth middleware before shipping auth
- Validate file uploads: restrict MIME types, scan for malicious content
- Redaction: Pino already redacts `authorization`, `cookie`, `set-cookie`, `x-api-key` headers and sensitive body fields (configurable in `@stockflow/config`)

## Performance rules

- Use `AppDataSource.transaction(...)` for multi-write operations (stock adjust, variant create with initial INWARD log)
- Filter in-memory only for small result sets (inventory channel filter); switch to query-level filtering as data grows
- Pino async logging; rotating file transport with gzip + max 14 files
- Rate limit: 100 req/min (global)
- Multipart limit: 5MB/file, 5 files

## Naming conventions

- Entities: `PascalCase.entity.ts` (e.g., `product-variant.entity.ts`) — file names kebab-case, class names PascalCase
- Repositories: `<entity-name>.repository.ts` — exports `<entity>Repository` + named finder/mutation functions
- Modules: `<name>.route.ts`, `<name>.controller.ts`, `<name>.service.ts`, `<name>.schema.ts`, `<name>.types.ts` (optional)
- Handlers: `post<Resource>Handler`, `get<Resource>Handler`, `patch<Resource>Handler`, `<resource>Handler`
- Schemas: `create<Resource>Schema`, `<resource>ResponseSchema`, `<resource>IdParamSchema`
- Enums: `PascalCase` (e.g., `SalesChannel`, `StockLogReason`, `VariantStatus`)
- Services: `kebab-case.service.ts`, exported functions named `action<Resource>` or `verb<Resource>`
- Config: `config` (singleton from `@stockflow/config`)

## Import conventions

- Workspace protocol: `@stockflow/shared`, `@stockflow/config`, `@stockflow/eslint-config`
- Path alias `@/` → `src/` within each app/package
- Barrel re-exports: `apps/server/src/configs/index.ts`, `apps/server/src/plugins/index.ts`, `apps/server/src/routes/index.ts`
- No circular imports (verified by Graphify); entity files import from entities, never from modules/services

## Repository layer

All database access goes through the repository layer in `apps/server/src/repositories/`:

| Repository | Entity | Key functions |
|------------|--------|---------------|
| `item.repository.ts` | Item | `findAllItems`, `createItem` |
| `design.repository.ts` | Design, Category, Supplier | `findCategoryById`, `findDesignByCode`, `findDesignByIdWithRelations`, `findSupplierById`, `createDesign` |
| `product-variant.repository.ts` | ProductVariant, ChannelPricing | `findVariantById`, `findVariantByIdWithPricings`, `findVariantBySku`, `findVariantsForInventory`, `findPricing`, `createPricing`, `savePricing` |
| `supplier.repository.ts` | Supplier | `findSupplierById`, `findSupplierByCode`, `findSupplierByEmail`, `findSupplierWithDesigns`, `countSuppliers`, `createSupplier`, `saveSupplier`, `removeSupplier`, `listSuppliers` |
| `user.repository.ts` | User | `findUserById`, `findUserByEmail`, `findUserWithRoles`, `createUser`, `saveUser` |
| `refresh-token.repository.ts` | RefreshToken | `findRefreshTokenByHash`, `createRefreshToken`, `saveRefreshToken`, `revokeAllUserTokens` |
| `stock-log.repository.ts` | StockLog | `createStockLog` |

**Rules:**
- Services import from repositories, never from `AppDataSource` directly
- Each repository exports the TypeORM repository instance + named functions
- Transaction-heavy code (e.g., `stock.service.ts`) may use `AppDataSource.transaction()` with `manager` — this is acceptable

## Code review checklist

- [ ] Prettier formatted (`pnpm format`)
- [ ] `pnpm typecheck` passes on all workspaces
- [ ] `pnpm lint` passes on all workspaces
- [ ] Zod schema covers all inputs/outputs; no `any`
- [ ] Service uses `AppError` subclasses, not raw throw strings
- [ ] Multi-write operations use `AppDataSource.transaction(...)`
- [ ] New module registered in `routes/index.ts`
- [ ] New entity has a migration (if schema changes)
- [ ] No secrets in `.env`, `src/`, or commits
- [ ] PATCH methods included in CORS methods list if applicable
- [ ] No direct `AppDataSource.getRepository()` calls in services

## AI implementation workflow

1. Read this file + relevant module files to match conventions
2. Search `apps/server/src/modules/` for similar modules (e.g., `designs/` is the cleanest reference)
3. Reuse existing schemas, error classes, and service patterns
4. Generate: `<name>.schema.ts` → `<name>.service.ts` → `<name>.controller.ts` → `<name>.routes.ts`
5. Register in `routes/index.ts`, update swagger tags if needed
6. Verify `pnpm build && pnpm typecheck && pnpm lint`

## Forbidden practices

- Do NOT use `any` type
- Do NOT throw raw strings; always use `AppError` subclasses
- Do NOT commit `.env`, `data/`, `uploads/`, `logs/`, `dist/`, `node_modules/`
- Do NOT bypass Zod validation
- Do NOT add routes directly in `app.ts`; always use module route files
- Do NOT use raw `fetch`/`JSON.parse` without error handling in web
- Do NOT duplicate entity/repository logic across service and repository files
- Do NOT call `AppDataSource.getRepository()` directly in services — use the repository layer

## Preferred patterns

- Module-per-resource with 4 files: routes, controller, service, schema
- Thin controllers: parse typed request, call service, reply.send/reply.code(201).send
- Zod-first validation: schema defines body/params/querystring/response; fastify-type-provider-zod handles transform + serialization
- Centralized error envelope via `app.ts` setErrorHandler
- Config injected via `@stockflow/config` singleton, never hardcoded env reads in app code
- Logger built via `buildLoggerConfig()` in `configs/logger.ts`; request IDs via `genRequestId`
- Repository layer for all DB access: `<entity>.repository.ts` exports repository instance + named functions
