import { AppDataSource } from '@/database/data-source';
import { Item } from '@/entities/item.entity';

export const itemRepository = AppDataSource.getRepository(Item);

export async function findAllItems(): Promise<Item[]> {
  return itemRepository.find();
}

export async function createItem(name: string): Promise<Item> {
  const item = itemRepository.create({ name });
  return itemRepository.save(item);
}
