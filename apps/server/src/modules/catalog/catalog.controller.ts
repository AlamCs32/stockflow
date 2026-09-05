import type { FastifyRequest, FastifyReply } from 'fastify';
import * as catalogService from './catalog.service';
import type { CreateCatalogEntryInput } from './catalog.schema';

export async function getCategoriesHandler(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  const categories = await catalogService.getCategories();
  reply.send({ categories });
}

export async function getCategoryFieldsHandler(
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply
) {
  const result = await catalogService.getCategoryFields(request.params.id);
  reply.send(result);
}

export async function createCatalogEntryHandler(
  request: FastifyRequest<{ Body: CreateCatalogEntryInput }>,
  reply: FastifyReply
) {
  const design = await catalogService.createCatalogEntry(request.body);
  reply.code(201).send({ design });
}
