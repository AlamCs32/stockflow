import { AppDataSource } from '@/database/data-source';
import { Category } from '@/entities/category.entity';

export const categoryRepository = AppDataSource.getRepository(Category);

export async function findAllCategories(): Promise<Category[]> {
  return categoryRepository.find({ order: { name: 'ASC' } });
}

export async function findCategoryById(id: number): Promise<Category | null> {
  return categoryRepository.findOne({ where: { id } });
}

export async function findCategoryByCode(code: string): Promise<Category | null> {
  return categoryRepository.findOne({ where: { code } });
}
