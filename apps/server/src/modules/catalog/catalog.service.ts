import { ConflictError, NotFoundError, BusinessRuleError } from '@/shared/errors';
import {
  findCategoryById,
} from '@/repositories/category.repository';
import {
  findDesignByCode,
  findSupplierById,
  createDesign,
} from '@/repositories/design.repository';
import type { CategoryFieldDef } from '@/entities/category.entity';

export async function getCategories() {
  const { findAllCategories } = await import('@/repositories/category.repository');
  return findAllCategories();
}

export async function getCategoryFields(categoryId: number) {
  const category = await findCategoryById(categoryId);
  if (!category) {
    throw new NotFoundError('Category');
  }
  return {
    categoryId: category.id,
    categoryName: category.name,
    fields: category.attributesSchema,
  };
}

export async function createCatalogEntry(input: {
  designCode: string;
  patternCode: string;
  name: string;
  supplierId: string;
  categoryId: number;
  categoryAttributes?: Record<string, unknown>;
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

  const attrs = input.categoryAttributes ?? {};
  validateCategoryAttributes(attrs, category.attributesSchema);

  return createDesign({
    designCode: input.designCode,
    patternCode: input.patternCode,
    name: input.name,
    supplierId: supplier.id,
    categoryId: category.id,
    categoryAttributes: attrs,
  });
}

function validateCategoryAttributes(
  attrs: Record<string, unknown>,
  schema: CategoryFieldDef[]
) {
  for (const field of schema) {
    if (field.required && (attrs[field.name] === undefined || attrs[field.name] === '')) {
      throw new BusinessRuleError(`Field "${field.label}" is required for this category`);
    }
    if (field.options && field.options.length > 0 && attrs[field.name] !== undefined) {
      const val = String(attrs[field.name]);
      if (!field.options.includes(val)) {
        throw new BusinessRuleError(
          `Field "${field.label}" must be one of: ${field.options.join(', ')}`
        );
      }
    }
  }
}
