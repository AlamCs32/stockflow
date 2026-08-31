# Stack — StockFlow

> Technology choices, versions, and rationale derived from the repository.

## Runtime
- **Node.js 24** (v24.17.0 confirmed in repo)
- **pnpm 11.9** (workspace-aware monorepo manager)

## Language & type system
- **TypeScript 5.4.5** — strict mode everywhere, `"type": "module"` (ESM)
- `tsconfig.base.json` — shared compiler options across all workspaces: `target: ES2022`, `module: ESNext`, `moduleResolution: bundler`, `strict`, `esModuleInterop`, `experimentalDecorators`, `emitDecoratorMetadata`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `declaration: true`
- Each workspace extends `tsconfig.base.json` with `paths: { "@/*": ["./src/*"] }`

## Backend framework
- **Fastify 4.27** — lightweight, schema-first, high-performance web framework
- **fastify-type-provider-zod 7** — bridges Zod schemas to Fastify's validation/serialization pipeline; `validatorCompiler` + `serializerCompiler` set in `app.ts`
- **Zod 4.4.3** — schema validation for all inputs/outputs; `.meta()` drives Swagger docs
- **@fastify/cors 9**, **@fastify/helmet 10**, **@fastify/rate-limit 8**, **@fastify/sensible 5**, **@fastify/multipart 8**, **@fastify/static 7**, **@fastify/swagger 8**, **@fastify/swagger-ui 2**

## Database
- **TypeORM 1.1** + **better-sqlite3 13** — SQLite ORM with migrations
- DB path: `data/database.sqlite` (gitignored)
- Migrations run automatically on startup (`migrationsRun: true`); `synchronize: false` by default
- Migration files: `apps/server/src/database/migrations/<timestamp>-<Name>.ts`
- TypeORM CLI accessed via `scripts/typeorm-cli.mjs` (tsx loader wrapper)

## Logging
- **Pino 10** — fast JSON logger
- **pino-pretty 13** — human-readable console output (dev only)
- **rotating-file-stream 3.2.9** — rotating file transport (CJS native addon)
- Redaction: `authorization`, `cookie`, `set-cookie`, `x-api-key` headers + sensitive body fields (password, token, apiKey, creditCard, etc.)
- Request IDs: `x-request-id` header or `randomUUID()`
- Two file transports: `combined` (all levels) + `error` (error level only), gzip compressed, 14 files max, 10MB each

## DevOps & tooling
- **Prettier 3.9.6** — code formatter
- **ESLint 10.8.0** (flat config) + **typescript-eslint 8.65.0** + **eslint-config-prettier 10.1.8** + **@eslint/js** + **globals** + **eslint-plugin-react-hooks 7.1.1**
- **rimraf 5.0.5** — cross-platform `rm -rf`
- **tsc-alias 1.8-1.9** — post-build alias resolution (`.ts` → `.js` with path mapping)
- **tsx 4.11** — TypeScript execution for dev server and seed script
- **ts-node 10.9.2** — available as dev dep

## Frontend
- **React 18.3.1** + **react-dom 18.3.1**
- **Vite 5.2.11** + **@vitejs/plugin-react 4.3.0**
- **@stockflow/shared** + **@stockflow/config** (workspace deps)
- Alias `@` → `./src`; Vite proxy `/api` → `http://localhost:3000`

## Domain enums
- `SalesChannel`: `MEESHO`, `FLIPKART`, `AMAZON`
- `StockLogReason`: `INWARD`, `SALE`, `RETURN`, `ADJUSTMENT`
- `VariantStatus`: `ACTIVE`, `INACTIVE`

## Why these choices (rationale from codebase)
- **Fastify over Express** — schema-first, built-in validation/serialization via Zod, smaller footprint, async-ready.
- **Zod over Joi/class-validator** — TypeScript-first, `.meta()` enriches Swagger without extra plugins, `fastify-type-provider-zod` integration is first-class.
- **SQLite over PostgreSQL/MySQL** — zero-ops, single-file, sufficient for initial scope; `better-sqlite3` is synchronous/fast for the expected data volume.
- **TypeORM over Prisma/Kysely** — entity decorator pattern is already established; migrations are auto-generated via TypeORM CLI.
- **Pino over Winston/morgan** — fast JSON logging, native integration with Fastify, async transport support, redaction built-in.
- **pnpm workspaces** — deterministic installs, workspace protocol (`workspace:*`) for local packages, shared tooling config.
- **pnpm onlyBuiltDependencies** — `esbuild`, `sqlite3`, `better-sqlite3` allowed to build natively.
