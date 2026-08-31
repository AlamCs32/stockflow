import { findAllItems } from '@/repositories/item.repository';

export function listItems() {
  return findAllItems();
}
