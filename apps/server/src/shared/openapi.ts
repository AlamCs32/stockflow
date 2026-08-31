import type { FastifySchema } from 'fastify';
import { z } from 'zod';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

/**
 * Standard error envelope returned by the global error handler in app.ts.
 * Reused so every endpoint documents consistent failure shapes.
 */
export const errorResponseSchema = z.object({
  statusCode: z.number(),
  error: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
});

type JsonSchemaTransformFn = (
  params: Record<string, unknown> & {
    schema?: FastifySchema;
    url: string;
    route: { method: string | string[] };
  }
) => { schema?: FastifySchema; url: string };

interface AutoTransformParams extends Record<string, unknown> {
  schema?: FastifySchema;
  url: string;
  route: { method: string | string[] };
}

function autoTagFromUrl(url: string): string {
  const path = url.split('?')[0];
  const segment = path.match(/^\/api\/([^/:]+)/)?.[1] ?? path.split('/')[1] ?? 'misc';
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

/**
 * Builds a stable operationId from the HTTP method and path,
 * e.g. PATCH /api/variants/:id/stock -> patchVariantsByIdStock.
 */
function deriveOperationId(method: string, url: string): string {
  const words = url
    .split('?')[0]
    .replace(/:([A-Za-z]+)/g, ' by $1')
    .split(/[^A-Za-z]+/)
    .filter(Boolean);

  const camelCase = words
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');

  const prefix = method.toLowerCase();
  return `${prefix}${camelCase.charAt(0).toUpperCase()}${camelCase.slice(1)}`;
}

/**
 * Wraps the zod provider's JSON Schema transform so every route gets,
 * without any per-route boilerplate:
 * - a tag derived from the first URL segment (/api/vendors -> Vendors)
 * - a deterministic operationId
 * - standard 400/404/500 error responses (explicit route responses win)
 */
export function autoSwaggerTransform(params: AutoTransformParams): {
  schema: FastifySchema;
  url: string;
} {
  const explicit = params.schema ?? {};
  const method = Array.isArray(params.route.method) ? params.route.method[0] : params.route.method;

  const transform = jsonSchemaTransform as unknown as JsonSchemaTransformFn;

  const result = transform({
    ...params,
    schema: {
      ...explicit,
      tags: explicit.tags ?? [autoTagFromUrl(params.url)],
      operationId: explicit.operationId ?? deriveOperationId(String(method), params.url),
      response: {
        400: errorResponseSchema,
        404: errorResponseSchema,
        500: errorResponseSchema,
        ...(explicit.response ?? {}),
      },
    },
  });

  return { schema: result.schema ?? {}, url: result.url };
}
