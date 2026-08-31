import type { FastifyInstance } from 'fastify';
import { postDesignHandler } from './design.controller';
import { createDesignResponseSchema, createDesignSchema } from './design.schema';

export default async function designRoutes(app: FastifyInstance) {
  app.post(
    '/api/designs',
    {
      schema: {
        tags: ['Designs'],
        summary: 'Add a new design tied to a vendor and category',
        description:
          'Validates that the referenced vendor and category exist. Design codes are unique.',
        body: createDesignSchema,
        response: { 201: createDesignResponseSchema },
      },
    },
    postDesignHandler
  );
}
