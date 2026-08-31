import type { FastifyInstance } from 'fastify';
import { getInventoryHandler } from './inventory.controller';
import { inventoryQuerySchema, inventoryResponseSchema } from './inventory.schema';

export default async function inventoryRoutes(app: FastifyInstance) {
  app.get(
    '/api/inventory',
    {
      schema: {
        tags: ['Inventory'],
        summary: 'List all variants with design info, prices, margins, and stock status',
        description:
          'Aggregated inventory view. Stock status is OUT_OF_STOCK at zero units and LOW_STOCK within the configured low-stock threshold.',
        querystring: inventoryQuerySchema,
        response: { 200: inventoryResponseSchema },
      },
    },
    getInventoryHandler
  );
}
