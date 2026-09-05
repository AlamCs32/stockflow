import type { FastifyInstance } from 'fastify';
import { uploadFileHandler } from './upload.controller';

export default async function uploadRoutes(app: FastifyInstance) {
  app.post(
    '/api/upload',
    {
      schema: {
        tags: ['Uploads'],
        summary: 'Upload a sample photo file',
        description:
          'Accepts multipart/form-data with a single file field and stores it under the configured uploads directory.',
        consumes: ['multipart/form-data'],
      },
    },
    uploadFileHandler
  );
}
