import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  adjustStock,
  createVariant,
  getVariantOrThrow,
  upsertPricing,
} from './variant.service';
import type {
  AdjustStockInput,
  CreateVariantInput,
  UpsertPricingInput,
  VariantIdParam,
} from './variant.schema';

export async function postVariantHandler(
  req: FastifyRequest<{ Body: CreateVariantInput }>,
  reply: FastifyReply
) {
  const variant = await createVariant(req.body);
  reply.code(201).send({ variant });
}

export async function getVariantHandler(
  req: FastifyRequest<{ Params: VariantIdParam }>,
  reply: FastifyReply
) {
  const variant = await getVariantOrThrow(req.params.id);
  reply.send({ variant });
}

export async function postPricingHandler(
  req: FastifyRequest<{ Params: VariantIdParam; Body: UpsertPricingInput }>,
  reply: FastifyReply
) {
  const pricing = await upsertPricing(req.params.id, req.body);
  reply.code(201).send({ pricing });
}

export async function patchStockHandler(
  req: FastifyRequest<{ Params: VariantIdParam; Body: AdjustStockInput }>,
  reply: FastifyReply
) {
  const result = await adjustStock(req.params.id, req.body);
  reply.send({
    variant: result.variant,
    stockLog: result.log,
  });
}
