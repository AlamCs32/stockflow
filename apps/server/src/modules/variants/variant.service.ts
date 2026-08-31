import { AppDataSource } from '@/database/data-source';
import { ChannelPricing, SalesChannel } from '@/entities/channel-pricing.entity';
import { Design } from '@/entities/design.entity';
import { ProductVariant } from '@/entities/product-variant.entity';
import { StockLog, StockLogReason } from '@/entities/stock-log.entity';
import { VariantStatus } from '@/entities/product-variant.entity';
import { ConflictError, NotFoundError } from '@/shared/errors';
import { buildSku } from '@/services/sku.service';
import { calculateMargin } from '@/services/pricing.service';
import { adjustStock as adjustStockAudit } from '@/services/stock.service';
import type { AdjustStockInput, CreateVariantInput, UpsertPricingInput } from './variant.schema';

const designRepository = AppDataSource.getRepository(Design);
const productVariantRepository = AppDataSource.getRepository(ProductVariant);
const channelPricingRepository = AppDataSource.getRepository(ChannelPricing);

export async function createVariant(input: CreateVariantInput): Promise<ProductVariant> {
  const design = await designRepository.findOne({
    where: { id: input.designId },
    relations: { vendor: true, category: true },
  });
  if (!design) {
    throw new NotFoundError('Design');
  }
  if (!design.vendor || !design.category) {
    throw new NotFoundError('Design vendor or category');
  }

  const sku = buildSku({
    vendorId: design.vendorId,
    categoryCode: design.category.code,
    designCode: design.designCode,
    costPrice: input.costPrice,
    colorCode: input.colorCode,
    size: input.size,
  });

  if (await productVariantRepository.findOne({ where: { sku } })) {
    throw new ConflictError(`Variant with SKU ${sku} already exists`);
  }

  return AppDataSource.transaction(async (manager) => {
    const variant = await manager.save(
      ProductVariant,
      manager.create(ProductVariant, {
        sku,
        colorName: input.colorName,
        colorCode: input.colorCode,
        size: input.size,
        costPrice: input.costPrice,
        stockQuantity: input.initialStock,
        samplePhotoUrl: input.samplePhotoUrl ?? null,
        status: input.status,
        designId: design.id,
      })
    );

    if (input.initialStock > 0) {
      await manager.save(
        StockLog,
        manager.create(StockLog, {
          variantId: variant.id,
          quantityChange: input.initialStock,
          reason: StockLogReason.INWARD,
          channel: null,
        })
      );
    }

    return variant;
  });
}

export async function upsertPricing(
  variantId: number,
  input: UpsertPricingInput
): Promise<ChannelPricing> {
  const variant = await productVariantRepository.findOne({ where: { id: variantId } });
  if (!variant) {
    throw new NotFoundError('Product variant');
  }

  const margin = calculateMargin(input.sellingPrice, variant.costPrice);
  const existing = await channelPricingRepository.findOne({
    where: { variantId, channelName: input.channelName },
  });

  if (existing) {
    existing.sellingPrice = input.sellingPrice;
    existing.margin = margin;
    return channelPricingRepository.save(existing);
  }

  const pricing = channelPricingRepository.create({
    variantId,
    channelName: input.channelName,
    sellingPrice: input.sellingPrice,
    margin,
  });
  return channelPricingRepository.save(pricing);
}

export async function adjustStock(variantId: number, input: AdjustStockInput) {
  return adjustStockAudit({
    variantId,
    quantityChange: input.quantityChange,
    reason: input.reason,
    channel: input.channel ?? null,
  });
}

export async function getVariantOrThrow(variantId: number): Promise<ProductVariant> {
  const variant = await productVariantRepository.findOne({
    where: { id: variantId },
    relations: { pricings: true },
  });
  if (!variant) {
    throw new NotFoundError('Product variant');
  }
  return variant;
}

export type { SalesChannel, VariantStatus };
