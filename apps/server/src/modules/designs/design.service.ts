import { AppDataSource } from '@/database/data-source';
import { Design } from '@/entities/design.entity';
import { Supplier } from '@/entities/supplier.entity';
import { ConflictError, NotFoundError } from '@/shared/errors';
import { findCategoryById, findDesignByCode } from '@/repositories/design.repository';

const designRepository = AppDataSource.getRepository(Design);
const supplierRepository = AppDataSource.getRepository(Supplier);

export async function createDesign(input: {
  designCode: string;
  patternCode: string;
  name: string;
  supplierId: string;
  categoryId: number;
}): Promise<Design> {
  const supplier = await supplierRepository.findOne({ where: { id: input.supplierId } });
  if (!supplier) {
    throw new NotFoundError(`Supplier ${input.supplierId}`);
  }

  const category = await findCategoryById(input.categoryId);
  if (!category) {
    throw new NotFoundError('Category');
  }

  if (await findDesignByCode(input.designCode)) {
    throw new ConflictError(`Design ${input.designCode} already exists`);
  }

  const design = designRepository.create({
    designCode: input.designCode,
    patternCode: input.patternCode,
    name: input.name,
    supplierId: supplier.id,
    categoryId: category.id,
  });
  return designRepository.save(design);
}
