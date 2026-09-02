import { AppDataSource } from '@/database/data-source';
import { ProductVariant } from '@/entities/product-variant.entity';
import { StockLog, StockLogReason } from '@/entities/stock-log.entity';
import { ConflictError, NotFoundError } from '@/shared/errors';
import { buildSku } from '@/services/sku.service';
import { calculateMargin } from '@/services/pricing.service';
import { adjustStock as adjustStockAudit } from '@/services/stock.service';
import type { AdjustStockInput, CreateVariantInput, UpsertPricingInput } from './variant.schema';
import { findDesignByIdWithRelations } from '@/repositories/design.repository';
import {
  findVariantBySku,
  findVariantByIdWithPricings,
  findPricing,
  savePricing,
  createPricing,
} from '@/repositories/product-variant.repository';
import type { ChannelPricing } from '@/entities/channel-pricing.entity';
import { VariantStatus } from '@/entities/product-variant.entity';

export { VariantStatus };
export type { SalesChannel } from '@/entities/channel-pricing.entity';

export async function createVariant(input: CreateVariantInput): Promise<ProductVariant> {
  const design = await findDesignByIdWithRelations(input.designId);
  if (!design) {
    throw new NotFoundError('Design');
  }
  if (!design.supplier || !design.category) {
    throw new NotFoundError('Design supplier or category');
  }

  const sku = buildSku({
    supplierId: design.supplierId,
    categoryCode: design.category.code,
    designCode: design.designCode,
    costPrice: input.costPrice,
    colorCode: input.colorCode,
    size: input.size,
  });

  if (await findVariantBySku(sku)) {
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
  const variant = await findVariantByIdWithPricings(variantId);
  if (!variant) {
    throw new NotFoundError('Product variant');
  }

  const margin = calculateMargin(input.sellingPrice, variant.costPrice);
  const existing = await findPricing(variantId, input.channelName);

  if (existing) {
    existing.sellingPrice = input.sellingPrice;
    existing.margin = margin;
    return savePricing(existing);
  }

  return createPricing({
    variantId,
    channelName: input.channelName,
    sellingPrice: input.sellingPrice,
    margin,
  });
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
  const variant = await findVariantByIdWithPricings(variantId);
  if (!variant) {
    throw new NotFoundError('Product variant');
  }
  return variant;
}
