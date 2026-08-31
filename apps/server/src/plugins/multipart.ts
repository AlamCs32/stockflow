import type { FastifyInstance } from 'fastify';
import multipart from '@fastify/multipart';

export default async function registerMultipart(app: FastifyInstance) {
  await app.register(multipart, {
    limits: {
      fileSize: 5 * 1024 * 1024,
      files: 5,
    },
  });
}
