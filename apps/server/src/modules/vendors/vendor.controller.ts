import type { FastifyReply, FastifyRequest } from 'fastify';
import { createVendor } from './vendor.service';
import type { CreateVendorInput } from './vendor.schema';

export async function postVendorHandler(
  req: FastifyRequest<{ Body: CreateVendorInput }>,
  reply: FastifyReply
) {
  const vendor = await createVendor(req.body);
  reply.code(201).send({ vendor });
}
