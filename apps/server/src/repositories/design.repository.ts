import { AppDataSource } from '@/database/data-source';
import { Category } from '@/entities/category.entity';
import { Design } from '@/entities/design.entity';
import { Supplier } from '@/entities/supplier.entity';

export const designRepository = AppDataSource.getRepository(Design);
export const categoryRepository = AppDataSource.getRepository(Category);
export const supplierRepository = AppDataSource.getRepository(Supplier);

export async function findCategoryById(id: number): Promise<Category | null> {
  return categoryRepository.findOne({ where: { id } });
}

export async function findDesignByCode(designCode: string): Promise<Design | null> {
  return designRepository.findOne({ where: { designCode } });
}

export async function findDesignById(id: number): Promise<Design | null> {
  return designRepository.findOne({ where: { id } });
}

export async function findDesignByIdWithRelations(id: number): Promise<Design | null> {
  return designRepository.findOne({
    where: { id },
    relations: { supplier: true, category: true },
  });
}

export async function findSupplierById(id: string): Promise<Supplier | null> {
  return supplierRepository.findOne({ where: { id } });
}

export async function createDesign(data: {
  designCode: string;
  patternCode: string;
  name: string;
  supplierId: string;
  categoryId: number;
  categoryAttributes?: Record<string, unknown>;
}): Promise<Design> {
  const design = designRepository.create(data);
  return designRepository.save(design);
}
