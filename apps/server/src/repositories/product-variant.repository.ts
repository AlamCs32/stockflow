import { AppDataSource } from '@/database/data-source';
import { ChannelPricing } from '@/entities/channel-pricing.entity';
import { ProductVariant } from '@/entities/product-variant.entity';

export const productVariantRepository = AppDataSource.getRepository(ProductVariant);
export const channelPricingRepository = AppDataSource.getRepository(ChannelPricing);

export async function findVariantById(id: number): Promise<ProductVariant | null> {
  return productVariantRepository.findOne({ where: { id } });
}

export async function findVariantBySku(sku: string): Promise<ProductVariant | null> {
  return productVariantRepository.findOne({ where: { sku } });
}

export async function findPricing(
  variantId: number,
  channelName: ChannelPricing['channelName']
): Promise<ChannelPricing | null> {
  return channelPricingRepository.findOne({ where: { variantId, channelName } });
}
