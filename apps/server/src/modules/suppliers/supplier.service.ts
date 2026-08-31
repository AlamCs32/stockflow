import { AppDataSource } from '@/database/data-source';
import { Supplier } from '@/entities/supplier.entity';
import { BusinessRuleError, ConflictError, NotFoundError } from '@/shared/errors';

const supplierRepository = AppDataSource.getRepository(Supplier);

async function generateSupplierCode(): Promise<string> {
  let sequence = (await supplierRepository.count()) + 1;
  for (;;) {
    const candidate = `S${String(sequence).padStart(3, '0')}`;
    const exists = await supplierRepository.findOne({ where: { code: candidate } });
    if (!exists) {
      return candidate;
    }
    sequence += 1;
  }
}

export async function createSupplier(input: {
  code?: string;
  name: string;
  contactEmail: string;
}): Promise<Supplier> {
  const code = input.code ?? (await generateSupplierCode());

  const existing = await supplierRepository.findOne({
    where: [{ code }, { contactEmail: input.contactEmail }],
  });
  if (existing) {
    throw new ConflictError(
      existing.code === code
        ? `Supplier ${code} already exists`
        : `Supplier with email ${input.contactEmail} already exists`
    );
  }

  const supplier = supplierRepository.create({
    code,
    name: input.name,
    contactEmail: input.contactEmail,
  });
  return supplierRepository.save(supplier);
}

export async function listSuppliers(): Promise<Supplier[]> {
  return supplierRepository.find({ order: { createdAt: 'DESC' } });
}

export async function getSupplierOrThrow(id: string): Promise<Supplier> {
  const supplier = await supplierRepository.findOne({ where: { id } });
  if (!supplier) {
    throw new NotFoundError('Supplier');
  }
  return supplier;
}

export async function updateSupplier(
  id: string,
  input: { name?: string; contactEmail?: string }
): Promise<Supplier> {
  const supplier = await getSupplierOrThrow(id);

  if (input.contactEmail && input.contactEmail !== supplier.contactEmail) {
    const existing = await supplierRepository.findOne({
      where: { contactEmail: input.contactEmail },
    });
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

  return supplierRepository.save(supplier);
}

export async function deleteSupplier(id: string): Promise<void> {
  const supplier = await supplierRepository.findOne({
    where: { id },
    relations: { designs: true },
  });
  if (!supplier) {
    throw new NotFoundError('Supplier');
  }
  if (supplier.designs && supplier.designs.length > 0) {
    throw new BusinessRuleError('Cannot delete supplier with associated designs');
  }
  await supplierRepository.remove(supplier);
}
