import type { FastifyRequest, FastifyReply } from 'fastify';
import { listItems } from './item.service';

export async function getItemsHandler(_req: FastifyRequest, reply: FastifyReply) {
  const items = await listItems();
  reply.send({ items });
}
