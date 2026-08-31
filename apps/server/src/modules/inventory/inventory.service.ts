import { config } from '@stockflow/config';
import { AppDataSource } from '@/database/data-source';
import { ProductVariant, VariantStatus } from '@/entities/product-variant.entity';
import type { InventoryQuery } from './inventory.schema';

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface InventoryItem {
  id: number;
  sku: string;
  colorName: string;
  colorCode: string;
  size: string;
  costPrice: number;
  stockQuantity: number;
  stockStatus: StockStatus;
  status: VariantStatus;
  samplePhotoUrl: string | null;
  design: {
    id: number;
    designCode: string;
    patternCode: string;
    name: string;
    vendor: { id: string; name: string } | null;
    category: { id: number; name: string; code: string } | null;
  };
  pricings: Array<{
    id: number;
    channelName: string;
    sellingPrice: number;
    margin: number;
  }>;
}

function resolveStockStatus(stockQuantity: number): StockStatus {
  if (stockQuantity <= 0) {
    return 'OUT_OF_STOCK';
  }
  if (stockQuantity <= config.inventory.lowStockThreshold) {
    return 'LOW_STOCK';
  }
  return 'IN_STOCK';
}

export async function listInventory(query: InventoryQuery): Promise<InventoryItem[]> {
  const variants = await AppDataSource.getRepository(ProductVariant).find({
    where: {
      ...(query.status ? { status: query.status } : {}),
      ...(query.designId ? { designId: query.designId } : {}),
    },
    relations: { design: { vendor: true, category: true }, pricings: true },
    order: { id: 'ASC' },
  });

  return variants
    .filter((variant) =>
      query.channel
        ? variant.pricings.some((pricing) => pricing.channelName === query.channel)
        : true
    )
    .map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      colorName: variant.colorName,
      colorCode: variant.colorCode,
      size: variant.size,
      costPrice: variant.costPrice,
      stockQuantity: variant.stockQuantity,
      stockStatus: resolveStockStatus(variant.stockQuantity),
      status: variant.status,
      samplePhotoUrl: variant.samplePhotoUrl ?? null,
      design: {
        id: variant.design?.id ?? variant.designId,
        designCode: variant.design?.designCode ?? '',
        patternCode: variant.design?.patternCode ?? '',
        name: variant.design?.name ?? '',
        vendor: variant.design?.vendor
          ? { id: variant.design.vendor.id, name: variant.design.vendor.name }
          : null,
        category: variant.design?.category
          ? {
              id: variant.design.category.id,
              name: variant.design.category.name,
              code: variant.design.category.code,
            }
          : null,
      },
      pricings: variant.pricings.map((pricing) => ({
        id: pricing.id,
        channelName: pricing.channelName,
        sellingPrice: pricing.sellingPrice,
        margin: pricing.margin,
      })),
    }));
}
