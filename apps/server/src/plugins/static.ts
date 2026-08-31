import path from 'node:path';
import type { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';
import { config } from '@/configs/index';

export const uploadsDir = path.resolve(config.uploads.dir);

export default async function registerStatic(app: FastifyInstance) {
  await app.register(fastifyStatic, {
    root: uploadsDir,
    prefix: '/uploads/',
  });
}
