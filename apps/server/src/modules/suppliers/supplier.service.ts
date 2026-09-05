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
import type { SupplierCategory, AvailabilityStatus } from '@/entities/supplier.entity';

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
  mobileNo: string;
  category?: SupplierCategory;
  trustScore?: number;
  qualityScore?: number;
  availabilityStatus?: AvailabilityStatus;
  leadTimeDays?: number | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  gstNumber?: string | null;
  panNumber?: string | null;
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
    mobileNo: input.mobileNo,
    category: input.category,
    trustScore: input.trustScore,
    qualityScore: input.qualityScore,
    availabilityStatus: input.availabilityStatus,
    leadTimeDays: input.leadTimeDays,
    address: input.address,
    city: input.city,
    state: input.state,
    gstNumber: input.gstNumber,
    panNumber: input.panNumber,
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
  input: {
    name?: string;
    contactEmail?: string;
    mobileNo?: string;
    category?: SupplierCategory;
    trustScore?: number;
    qualityScore?: number;
    availabilityStatus?: AvailabilityStatus;
    leadTimeDays?: number | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    gstNumber?: string | null;
    panNumber?: string | null;
  }
) {
  const supplier = await getSupplierOrThrow(id);

  if (input.contactEmail && input.contactEmail !== supplier.contactEmail) {
    const existing = await findSupplierByEmail(input.contactEmail);
    if (existing) {
      throw new ConflictError(`Supplier with email ${input.contactEmail} already exists`);
    }
  }

  if (input.name !== undefined) supplier.name = input.name;
  if (input.contactEmail !== undefined) supplier.contactEmail = input.contactEmail;
  if (input.mobileNo !== undefined) supplier.mobileNo = input.mobileNo;
  if (input.category !== undefined) supplier.category = input.category;
  if (input.trustScore !== undefined) supplier.trustScore = input.trustScore;
  if (input.qualityScore !== undefined) supplier.qualityScore = input.qualityScore;
  if (input.availabilityStatus !== undefined) supplier.availabilityStatus = input.availabilityStatus;
  if (input.leadTimeDays !== undefined) supplier.leadTimeDays = input.leadTimeDays;
  if (input.address !== undefined) supplier.address = input.address;
  if (input.city !== undefined) supplier.city = input.city;
  if (input.state !== undefined) supplier.state = input.state;
  if (input.gstNumber !== undefined) supplier.gstNumber = input.gstNumber;
  if (input.panNumber !== undefined) supplier.panNumber = input.panNumber;

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
