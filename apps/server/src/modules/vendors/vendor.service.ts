import { AppDataSource } from '@/database/data-source';
import { Vendor } from '@/entities/vendor.entity';
import { ConflictError } from '@/shared/errors';

const vendorRepository = AppDataSource.getRepository(Vendor);

async function generateVendorId(): Promise<string> {
  let sequence = (await vendorRepository.count()) + 1;
  for (;;) {
    const candidate = `V${String(sequence).padStart(3, '0')}`;
    const exists = await vendorRepository.findOne({ where: { id: candidate } });
    if (!exists) {
      return candidate;
    }
    sequence += 1;
  }
}

export async function createVendor(input: {
  id?: string;
  name: string;
  contactEmail: string;
}): Promise<Vendor> {
  const id = input.id ?? (await generateVendorId());

  const existing = await vendorRepository.findOne({
    where: [{ id }, { contactEmail: input.contactEmail }],
  });
  if (existing) {
    throw new ConflictError(
      existing.id === id
        ? `Vendor ${id} already exists`
        : `Vendor with email ${input.contactEmail} already exists`
    );
  }

  const vendor = vendorRepository.create({
    id,
    name: input.name,
    contactEmail: input.contactEmail,
  });
  return vendorRepository.save(vendor);
}
