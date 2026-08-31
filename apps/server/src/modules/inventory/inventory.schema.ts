import { z } from 'zod';
import { SalesChannel } from '@/entities/channel-pricing.entity';
import { VariantStatus } from '@/entities/product-variant.entity';

export const inventoryQuerySchema = z.object({
  status: z.enum(VariantStatus).optional().meta({ description: 'Filter by variant status' }),
  designId: z.coerce.number().int().positive().optional().meta({ description: 'Filter by design id', examples: [1] }),
  channel: z.enum(SalesChannel).optional().meta({ description: 'Only variants priced on this channel' }),
});

export const stockStatusSchema = z.enum(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK']);

export const inventoryItemSchema = z.object({
  id: z.number(),
  sku: z.string(),
  colorName: z.string(),
  colorCode: z.string(),
  size: z.string(),
  costPrice: z.number(),
  stockQuantity: z.number(),
  stockStatus: stockStatusSchema,
  status: z.enum(VariantStatus),
  samplePhotoUrl: z.string().nullable(),
  design: z.object({
    id: z.number(),
    designCode: z.string(),
    patternCode: z.string(),
    name: z.string(),
    vendor: z.object({ id: z.string(), name: z.string() }).nullable(),
    category: z.object({ id: z.number(), name: z.string(), code: z.string() }).nullable(),
  }),
  pricings: z.array(
    z.object({
      id: z.number(),
      channelName: z.enum(SalesChannel),
      sellingPrice: z.number(),
      margin: z.number(),
    })
  ),
});

export const inventoryResponseSchema = z.object({
  items: z.array(inventoryItemSchema),
  count: z.number(),
});

export type InventoryQuery = z.infer<typeof inventoryQuerySchema>;
