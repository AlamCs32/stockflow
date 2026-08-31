import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getItemsHandler } from './item.controller';

const itemSchema = z.object({
  id: z.number(),
  name: z.string(),
  userId: z.number().nullable(),
  categoryId: z.number().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export default async function itemRoutes(app: FastifyInstance) {
  app.get(
    '/api/items',
    {
      schema: {
        tags: ['Items'],
        summary: 'List all items',
        response: { 200: z.object({ items: z.array(itemSchema) }) },
      },
    },
    getItemsHandler
  );
}
