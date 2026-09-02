import { AppDataSource } from '@/database/data-source';
import { ChannelPricing } from '@/entities/channel-pricing.entity';
import { ProductVariant } from '@/entities/product-variant.entity';
import type { VariantStatus } from '@/entities/product-variant.entity';

export const productVariantRepository = AppDataSource.getRepository(ProductVariant);
export const channelPricingRepository = AppDataSource.getRepository(ChannelPricing);

export async function findVariantById(id: number): Promise<ProductVariant | null> {
  return productVariantRepository.findOne({ where: { id } });
}

export async function findVariantByIdWithPricings(id: number): Promise<ProductVariant | null> {
  return productVariantRepository.findOne({
    where: { id },
    relations: { pricings: true },
  });
}

export async function findVariantBySku(sku: string): Promise<ProductVariant | null> {
  return productVariantRepository.findOne({ where: { sku } });
}

export async function findVariantWithDesign(
  id: number
): Promise<ProductVariant | null> {
  return productVariantRepository.findOne({
    where: { id },
    relations: { design: { supplier: true, category: true } },
  });
}

export async function findVariantsForInventory(filters: {
  status?: VariantStatus;
  designId?: number;
}): Promise<ProductVariant[]> {
  return productVariantRepository.find({
    where: {
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.designId ? { designId: filters.designId } : {}),
    },
    relations: { design: { supplier: true, category: true }, pricings: true },
    order: { id: 'ASC' },
  });
}

export async function saveVariant(variant: ProductVariant): Promise<ProductVariant> {
  return productVariantRepository.save(variant);
}

export async function createVariant(data: Partial<ProductVariant>): Promise<ProductVariant> {
  const variant = productVariantRepository.create(data);
  return productVariantRepository.save(variant);
}

export async function findPricing(
  variantId: number,
  channelName: ChannelPricing['channelName']
): Promise<ChannelPricing | null> {
  return channelPricingRepository.findOne({ where: { variantId, channelName } });
}

export async function savePricing(pricing: ChannelPricing): Promise<ChannelPricing> {
  return channelPricingRepository.save(pricing);
}

export async function createPricing(data: {
  variantId: number;
  channelName: ChannelPricing['channelName'];
  sellingPrice: number;
  margin: number;
}): Promise<ChannelPricing> {
  const pricing = channelPricingRepository.create(data);
  return channelPricingRepository.save(pricing);
}
