import { BusinessRuleError, ConflictError, NotFoundError } from '@/shared/errors';
import {
  countSuppliers,
  findSupplierByCode,
  findSupplierByEmail,
  findSupplierById,
  findSupplierWithDesigns,
  createSupplier,
  saveSupplier,
  removeSupplier,
  listSuppliers as listAllSuppliers,
} from '@/repositories/supplier.repository';

async function generateSupplierCode(): Promise<string> {
  let sequence = (await countSuppliers()) + 1;
  for (;;) {
    const candidate = `S${String(sequence).padStart(3, '0')}`;
    const exists = await findSupplierByCode(candidate);
    if (!exists) {
      return candidate;
    }
    sequence += 1;
  }
}

export async function createSupplierService(input: {
  code?: string;
  name: string;
  contactEmail: string;
}) {
  const code = input.code ?? (await generateSupplierCode());

  const existingByCode = await findSupplierByCode(code);
  if (existingByCode) {
    throw new ConflictError(`Supplier ${code} already exists`);
  }

  const existingByEmail = await findSupplierByEmail(input.contactEmail);
  if (existingByEmail) {
    throw new ConflictError(`Supplier with email ${input.contactEmail} already exists`);
  }

  return createSupplier({
    code,
    name: input.name,
    contactEmail: input.contactEmail,
  });
}

export async function listSuppliers() {
  return listAllSuppliers();
}

export async function getSupplierOrThrow(id: string) {
  const supplier = await findSupplierById(id);
  if (!supplier) {
    throw new NotFoundError('Supplier');
  }
  return supplier;
}

export async function updateSupplier(
  id: string,
  input: { name?: string; contactEmail?: string }
) {
  const supplier = await getSupplierOrThrow(id);

  if (input.contactEmail && input.contactEmail !== supplier.contactEmail) {
    const existing = await findSupplierByEmail(input.contactEmail);
    if (existing) {
      throw new ConflictError(`Supplier with email ${input.contactEmail} already exists`);
    }
  }

  if (input.name !== undefined) {
    supplier.name = input.name;
  }
  if (input.contactEmail !== undefined) {
    supplier.contactEmail = input.contactEmail;
  }

  return saveSupplier(supplier);
}

export async function deleteSupplier(id: string): Promise<void> {
  const supplier = await findSupplierWithDesigns(id);
  if (!supplier) {
    throw new NotFoundError('Supplier');
  }
  if (supplier.designs && supplier.designs.length > 0) {
    throw new BusinessRuleError('Cannot delete supplier with associated designs');
  }
  await removeSupplier(supplier);
}
