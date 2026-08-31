import type { FastifyReply, FastifyRequest } from 'fastify';
import { listInventory } from './inventory.service';
import type { InventoryQuery } from './inventory.schema';

export async function getInventoryHandler(
  req: FastifyRequest<{ Querystring: InventoryQuery }>,
  reply: FastifyReply
) {
  const items = await listInventory(req.query);
  reply.send({ items, count: items.length });
}
