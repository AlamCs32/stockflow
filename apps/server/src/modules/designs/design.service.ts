import { AppDataSource } from '@/database/data-source';
import { Design } from '@/entities/design.entity';
import { Vendor } from '@/entities/vendor.entity';
import { ConflictError, NotFoundError } from '@/shared/errors';
import { findCategoryById, findDesignByCode } from '@/repositories/design.repository';

const designRepository = AppDataSource.getRepository(Design);
const vendorRepository = AppDataSource.getRepository(Vendor);

export async function createDesign(input: {
  designCode: string;
  patternCode: string;
  name: string;
  vendorId: string;
  categoryId: number;
}): Promise<Design> {
  const vendor = await vendorRepository.findOne({ where: { id: input.vendorId } });
  if (!vendor) {
    throw new NotFoundError(`Vendor ${input.vendorId}`);
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
    vendorId: vendor.id,
    categoryId: category.id,
  });
  return designRepository.save(design);
}
