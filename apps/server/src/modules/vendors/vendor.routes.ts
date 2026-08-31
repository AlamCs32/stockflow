import type { FastifyInstance } from 'fastify';
import { postVendorHandler } from './vendor.controller';
import { createVendorResponseSchema, createVendorSchema } from './vendor.schema';

export default async function vendorRoutes(app: FastifyInstance) {
  app.post(
    '/api/vendors',
    {
      schema: {
        tags: ['Vendors'],
        summary: 'Add a new vendor',
        description:
          'Vendor id is auto-generated (V001, V002, ...) when omitted. Contact email must be unique.',
        body: createVendorSchema,
        response: { 201: createVendorResponseSchema },
      },
    },
    postVendorHandler
  );
}
