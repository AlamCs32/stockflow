import { ConflictError, NotFoundError } from '@/shared/errors';
import {
  findCategoryById,
  findDesignByCode,
  findSupplierById,
  createDesign as createDesignRecord,
} from '@/repositories/design.repository';

export async function createDesign(input: {
  designCode: string;
  patternCode: string;
  name: string;
  supplierId: string;
  categoryId: number;
}) {
  const supplier = await findSupplierById(input.supplierId);
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

  return createDesignRecord({
    designCode: input.designCode,
    patternCode: input.patternCode,
    name: input.name,
    supplierId: supplier.id,
    categoryId: category.id,
  });
}
