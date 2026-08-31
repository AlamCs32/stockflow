# Coding Rules & Guardrails

> These rules govern how code is generated for this repository.
> Derived from the existing codebase conventions.

## Overarching principle

Prefer the repository's existing patterns over generic best practices. When a pattern exists, reuse it exactly.

## Language & type safety

- TypeScript strict mode everywhere. `"noUnusedLocals"`, `"noUnusedParameters"`, `"noFallthroughCasesInSwitch"` enforced.
- **No `any`** unless absolutely necessary. Infer types from Zod schemas, entity columns, or existing APIs.
- Use `z.infer<typeof schema>` to derive request/response types from Zod schemas.
- Use `FastifyRequest<{ Body: X }>`, `FastifyRequest<{ Params: X }>`, `FastifyRequest<{ Querystring: X }>` from `fastify-type-provider-zod`.

## Formatting & linting

- **Prettier** — `pnpm format` before commits. Config: `singleQuote`, `semi`, `trailingComma: es5`, `printWidth: 100`, `tabWidth: 2`, `arrowParens: always`, `endOfLine: auto`.
- **ESLint** — flat config via `@stockflow/eslint-config`. Web adds `eslint-plugin-react-hooks`.
- Run `pnpm build && pnpm typecheck && pnpm lint && pnpm format` before committing.

## Error handling

- **Always** throw `AppError` subclasses: `NotFoundError(404)`, `ConflictError(409)`, `BusinessRuleError(422)`.
- Never throw raw strings.
- Never return raw error objects to clients — the global error handler in `app.ts` formats everything.
- Business rules (stock constraints, uniqueness, quantity validation) → `BusinessRuleError`.
- Resource not found → `NotFoundError(resourceName)`.
- Uniqueness violation → `ConflictError(message)`.

## Validation

- All request validation via Zod schemas in `<module>.schema.ts`.
- Use `.meta({ description, examples })` on schema fields for OpenAPI documentation.
- Use `.transform()` for normalization (e.g., `.toUpperCase()` on codes).
- Use `.coerce.number()` / `.coerce.int()` for query/param numeric coercion.
- Never add custom validation logic outside Zod — the route schema drives fastify validation and Swagger docs.

## Database

- Use `AppDataSource.transaction(...)` for any multi-write operation (e.g., create variant + INWARD stock log, adjust stock + write log).
- Use `manager` from the transaction, never the global `AppDataSource.getRepository()` inside a transaction.
- `synchronize: false` by default; always use migrations.
- Entity columns: snake_case DB names via explicit `@Column({ name: ... })`.

## Authentication & authorization

- **No auth is implemented.** `bearerAuth` in OpenAPI is documentation-only.
- Do not add auth middleware, JWT verification, or login endpoints without explicit instruction.
- The `User` entity exists with a plaintext `password` field — do not seed plaintext passwords in real implementations.

## File structure conventions

- New backend module → `apps/server/src/modules/<name>/` with exactly 4 files: `routes.ts`, `controller.ts`, `service.ts`, `schema.ts`.
- New entity → `apps/server/src/entities/<name>.entity.ts`.
- New repository helper → `apps/server/src/repositories/<entity>.repository.ts`.
- New shared type → add to existing `shared/` file or create `shared/<name>.ts` (avoid empty directories).
- Register new routes in `apps/server/src/routes/index.ts`.

## Import rules

- Use workspace protocol: `@stockflow/shared`, `@stockflow/config`, `@stockflow/eslint-config`.
- Use `@/` alias for `src/` within each workspace.
- Barrel re-exports: `configs/index.ts`, `plugins/index.ts`, `routes/index.ts`.
- Entity files import from other entities directly; never from modules/services.
- No circular imports.

## Commit conventions

- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`.
- Never commit `.env`, `data/`, `uploads/`, `logs/`, `dist/`, `node_modules/`.

## Forbidden patterns

- Do NOT add routes directly in `app.ts`.
- Do NOT bypass Zod validation.
- Do NOT duplicate entity/repository logic across service and repository files.
- Do NOT use `any` type.
- Do NOT use raw `fetch`/`JSON.parse` without error handling in the web app.

## Testing

- No test framework is installed yet. When adding tests, prefer Vitest (aligned with Vite/web).
- Place tests in `apps/server/tests/` and `apps/web/tests/`.
- Mock `AppDataSource` repositories for service unit tests.
