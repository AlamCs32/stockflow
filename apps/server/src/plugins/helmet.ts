import type { FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';

export default async function registerHelmet(app: FastifyInstance) {
  await app.register(helmet);
}
