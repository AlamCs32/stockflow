import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getHealthHandler } from './health.controller';

const healthResponseSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.coerce.date(),
});

export default async function healthRoutes(app: FastifyInstance) {
  app.get(
    '/health',
    {
      schema: {
        tags: ['Health'],
        summary: 'Service health check',
        response: { 200: healthResponseSchema },
      },
    },
    getHealthHandler
  );
}
