import type { FastifyRequest, FastifyReply } from 'fastify';
import { getHealth } from './health.service';

export async function getHealthHandler(_req: FastifyRequest, reply: FastifyReply) {
  reply.send(getHealth());
}
