import { AppDataSource } from '@/database/data-source';
import { Supplier, SupplierCategory, AvailabilityStatus } from '@/entities/supplier.entity';

export const supplierRepository = AppDataSource.getRepository(Supplier);

export async function findSupplierById(id: string): Promise<Supplier | null> {
  return supplierRepository.findOne({ where: { id } });
}

export async function findSupplierByCode(code: string): Promise<Supplier | null> {
  return supplierRepository.findOne({ where: { code } });
}

export async function findSupplierByEmail(contactEmail: string): Promise<Supplier | null> {
  return supplierRepository.findOne({ where: { contactEmail } });
}

export async function findSupplierWithDesigns(id: string): Promise<Supplier | null> {
  return supplierRepository.findOne({ where: { id }, relations: { designs: true } });
}

export async function countSuppliers(): Promise<number> {
  return supplierRepository.count();
}

export async function createSupplier(data: {
  code: string;
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
}): Promise<Supplier> {
  const supplier = supplierRepository.create(data);
  return supplierRepository.save(supplier);
}

export async function saveSupplier(supplier: Supplier): Promise<Supplier> {
  return supplierRepository.save(supplier);
}

export async function removeSupplier(supplier: Supplier): Promise<void> {
  await supplierRepository.remove(supplier);
}

export async function listSuppliers(): Promise<Supplier[]> {
  return supplierRepository.find({ order: { createdAt: 'DESC' } });
}
