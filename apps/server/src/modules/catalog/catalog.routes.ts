import type { FastifyInstance } from 'fastify';
import {
  getCategoriesHandler,
  getCategoryFieldsHandler,
  createCatalogEntryHandler,
} from './catalog.controller';
import {
  categoryListResponseSchema,
  categoryIdParamSchema,
  categoryFieldsResponseSchema,
  createCatalogEntrySchema,
  catalogEntryResponseSchema,
} from './catalog.schema';

export default async function catalogRoutes(app: FastifyInstance) {
  app.get(
    '/api/catalog/categories',
    {
      schema: {
        tags: ['Catalog'],
        summary: 'List all categories with their attribute schemas',
        response: { 200: categoryListResponseSchema },
      },
    },
    getCategoriesHandler
  );

  app.get(
    '/api/catalog/categories/:id/fields',
    {
      schema: {
        tags: ['Catalog'],
        summary: 'Get category-specific field definitions for the dynamic form',
        params: categoryIdParamSchema,
        response: { 200: categoryFieldsResponseSchema },
      },
    },
    getCategoryFieldsHandler
  );

  app.post(
    '/api/catalog/entries',
    {
      schema: {
        tags: ['Catalog'],
        summary: 'Create a catalog entry (Design with category-specific attributes)',
        description:
          'Creates a new Design linked to a Category and Supplier. The categoryAttributes object must conform to the category attributesSchema.',
        body: createCatalogEntrySchema,
        response: { 201: catalogEntryResponseSchema },
      },
    },
    createCatalogEntryHandler
  );
}
