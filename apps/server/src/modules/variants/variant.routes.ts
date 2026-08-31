import type { FastifyInstance } from 'fastify';
import {
  getVariantHandler,
  patchStockHandler,
  postPricingHandler,
  postVariantHandler,
} from './variant.controller';
import {
  adjustStockResponseSchema,
  adjustStockSchema,
  createVariantResponseSchema,
  createVariantSchema,
  upsertPricingResponseSchema,
  upsertPricingSchema,
  variantIdParamSchema,
  variantWithPricingsResponseSchema,
} from './variant.schema';

export default async function variantRoutes(app: FastifyInstance) {
  app.post(
    '/api/variants',
    {
      schema: {
        tags: ['Variants'],
        summary: 'Create a product variant (SKU)',
        description:
          'Generates the SKU as VENDOR-CATEGORY-DESIGN-COST-COLOR-SIZE (e.g. V001-KRT-D001-130-BLK-XL) and records the initial stock as an INWARD stock log inside a database transaction.',
        body: createVariantSchema,
        response: { 201: createVariantResponseSchema },
      },
    },
    postVariantHandler
  );

  app.get(
    '/api/variants/:id',
    {
      schema: {
        tags: ['Variants'],
        summary: 'Get a variant with its channel pricings',
        params: variantIdParamSchema,
        response: { 200: variantWithPricingsResponseSchema },
      },
    },
    getVariantHandler
  );

  app.post(
    '/api/variants/:id/pricing',
    {
      schema: {
        tags: ['Variants'],
        summary: 'Add or update multi-channel pricing',
        description:
          'Upserts the selling price per sales channel. The margin is auto-calculated as sellingPrice - variant.costPrice on create and update.',
        params: variantIdParamSchema,
        body: upsertPricingSchema,
        response: { 201: upsertPricingResponseSchema },
      },
    },
    postPricingHandler
  );

  app.patch(
    '/api/variants/:id/stock',
    {
      schema: {
        tags: ['Variants'],
        summary: 'Adjust stock with an audit log entry',
        description:
          'Applies a signed quantity change to the variant stock and writes a StockLog entry in one transaction. INWARD and RETURN require positive changes, SALE requires negative, ADJUSTMENT accepts any non-zero change.',
        security: [{ bearerAuth: [] }],
        params: variantIdParamSchema,
        body: adjustStockSchema,
        response: { 200: adjustStockResponseSchema },
      },
    },
    patchStockHandler
  );
}
