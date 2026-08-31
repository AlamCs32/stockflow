import type { FastifyReply, FastifyRequest } from 'fastify';
import {
  createSupplier,
  listSuppliers,
  getSupplierOrThrow,
  updateSupplier,
  deleteSupplier,
} from './supplier.service';
import type { CreateSupplierInput, SupplierIdParam, UpdateSupplierInput } from './supplier.schema';

export async function postSupplierHandler(
  req: FastifyRequest<{ Body: CreateSupplierInput }>,
  reply: FastifyReply
) {
  const supplier = await createSupplier(req.body);
  reply.code(201).send({ supplier });
}

export async function listSuppliersHandler(_req: FastifyRequest, reply: FastifyReply) {
  const suppliers = await listSuppliers();
  reply.send({ suppliers, count: suppliers.length });
}

export async function getSupplierHandler(
  req: FastifyRequest<{ Params: SupplierIdParam }>,
  reply: FastifyReply
) {
  const supplier = await getSupplierOrThrow(req.params.id);
  reply.send({ supplier });
}

export async function updateSupplierHandler(
  req: FastifyRequest<{ Params: SupplierIdParam; Body: UpdateSupplierInput }>,
  reply: FastifyReply
) {
  const supplier = await updateSupplier(req.params.id, req.body);
  reply.send({ supplier });
}

export async function deleteSupplierHandler(
  req: FastifyRequest<{ Params: SupplierIdParam }>,
  reply: FastifyReply
) {
  await deleteSupplier(req.params.id);
  reply.code(204).send();
}
