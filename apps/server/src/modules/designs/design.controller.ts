import type { FastifyReply, FastifyRequest } from 'fastify';
import { createDesign } from './design.service';
import type { CreateDesignInput } from './design.schema';

export async function postDesignHandler(
  req: FastifyRequest<{ Body: CreateDesignInput }>,
  reply: FastifyReply
) {
  const design = await createDesign(req.body);
  reply.code(201).send({ design });
}
