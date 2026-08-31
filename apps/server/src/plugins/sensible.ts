import type { FastifyInstance } from 'fastify';
import sensible from '@fastify/sensible';

export default async function registerSensible(app: FastifyInstance) {
  await app.register(sensible);
}
