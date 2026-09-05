import type { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { config } from '@stockflow/config';
import { autoSwaggerTransform } from '@/shared/openapi';

/**
 * OpenAPI documentation plugin.
 *
 * Registration order matters and is enforced in plugins/index.ts:
 *   1. @fastify/swagger  (builds the spec from route schemas)
 *   2. @fastify/swagger-ui (serves the interactive UI + /docs/json spec)
 *   3. application routes last, so they are captured in the document
 */
export default async function registerSwagger(app: FastifyInstance) {
  if (!config.swagger.enabled) {
    return;
  }

  // Step 1: core spec generator. `transform` converts the Zod schemas
  // declared on each route into OpenAPI JSON Schema components.
  await app.register(swagger, {
    transform: autoSwaggerTransform,
    openapi: {
      info: {
        title: config.swagger.title,
        description: config.swagger.description,
        version: config.swagger.version,
      },
      servers: [{ url: `http://localhost:${config.server.port}` }],
      // Bearer/JWT scheme definition. Apply per route with:
      //   schema: { security: [{ bearerAuth: [] }] }
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Paste a JWT issued by the auth service.',
          },
        },
      },
      tags: [
        { name: 'Auth', description: 'Authentication and authorization' },
        { name: 'Suppliers', description: 'Supplier master data' },
        { name: 'Designs', description: 'Design catalog tied to suppliers and categories' },
        { name: 'Variants', description: 'SKU units with pricing and stock control' },
        { name: 'Inventory', description: 'Aggregated inventory views' },
        { name: 'Uploads', description: 'File uploads' },
        { name: 'Health', description: 'Service health checks' },
      ],
    },
  });

  // Step 2: interactive UI at the configured prefix (/docs by default).
  // The raw spec is exposed automatically at <prefix>/json.
  await app.register(swaggerUi, {
    routePrefix: config.swagger.routePrefix,
    uiConfig: {
      docExpansion: 'none',
      deepLinking: true,
      displayRequestDuration: true,
      persistAuthorization: true,
    },
  });
}
