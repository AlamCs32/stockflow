import type { FastifyInstance } from 'fastify';
import {
  postSupplierHandler,
  listSuppliersHandler,
  getSupplierHandler,
  updateSupplierHandler,
  deleteSupplierHandler,
} from './supplier.controller';
import {
  createSupplierResponseSchema,
  createSupplierSchema,
  supplierIdParamSchema,
  supplierListResponseSchema,
  updateSupplierSchema,
  updateSupplierResponseSchema,
} from './supplier.schema';

export default async function supplierRoutes(app: FastifyInstance) {
  app.post(
    '/api/suppliers',
    {
      schema: {
        tags: ['Suppliers'],
        summary: 'Add a new supplier',
        description:
          'Supplier code is auto-generated (S001, S002, ...) when omitted. Contact email must be unique.',
        body: createSupplierSchema,
        response: { 201: createSupplierResponseSchema },
      },
    },
    postSupplierHandler
  );

  app.get(
    '/api/suppliers',
    {
      schema: {
        tags: ['Suppliers'],
        summary: 'List all suppliers',
        response: { 200: supplierListResponseSchema },
      },
    },
    listSuppliersHandler
  );

  app.get(
    '/api/suppliers/:id',
    {
      schema: {
        tags: ['Suppliers'],
        summary: 'Get supplier by ID',
        params: supplierIdParamSchema,
        response: { 200: createSupplierResponseSchema },
      },
    },
    getSupplierHandler
  );

  app.patch(
    '/api/suppliers/:id',
    {
      schema: {
        tags: ['Suppliers'],
        summary: 'Update supplier fields',
        params: supplierIdParamSchema,
        body: updateSupplierSchema,
        response: { 200: updateSupplierResponseSchema },
      },
    },
    updateSupplierHandler
  );

  app.delete(
    '/api/suppliers/:id',
    {
      schema: {
        tags: ['Suppliers'],
        summary: 'Delete a supplier',
        description: 'Fails if the supplier has associated designs.',
        params: supplierIdParamSchema,
      },
    },
    deleteSupplierHandler
  );
}
