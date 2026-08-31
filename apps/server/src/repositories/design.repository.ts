import { AppDataSource } from '@/database/data-source';
import { Category } from '@/entities/category.entity';
import { Design } from '@/entities/design.entity';

export const designRepository = AppDataSource.getRepository(Design);
export const categoryRepository = AppDataSource.getRepository(Category);

export async function findCategoryById(id: number): Promise<Category | null> {
  return categoryRepository.findOne({ where: { id } });
}

export async function findDesignByCode(designCode: string): Promise<Design | null> {
  return designRepository.findOne({ where: { designCode } });
}

export async function createDesign(
  data: Pick<Design, 'designCode' | 'patternCode' | 'name' | 'vendorId' | 'categoryId'>
): Promise<Design> {
  const design = designRepository.create(data);
  return designRepository.save(design);
}
