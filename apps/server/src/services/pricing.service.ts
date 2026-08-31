import { SalesChannel } from '@/entities/channel-pricing.entity';

export function calculateMargin(sellingPrice: number, costPrice: number): number {
  const margin = sellingPrice - costPrice;
  return Math.round(margin * 100) / 100;
}

export function isSalesChannel(value: string): value is SalesChannel {
  return Object.values(SalesChannel).includes(value as SalesChannel);
}
