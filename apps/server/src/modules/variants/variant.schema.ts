import { z } from 'zod';
import { SalesChannel } from '@/entities/channel-pricing.entity';
import { StockLogReason } from '@/entities/stock-log.entity';
import { VariantStatus } from '@/entities/product-variant.entity';

export const createVariantSchema = z.object({
  designId: z.coerce
    .number()
    .int()
    .positive()
    .meta({ description: 'Design the variant belongs to', examples: [1] }),
  colorName: z
    .string()
    .trim()
    .min(1)
    .max(60)
    .meta({ description: 'Human-readable color name', examples: ['Black'] }),
  colorCode: z
    .string()
    .trim()
    .min(2)
    .max(8)
    .regex(/^[A-Za-z]+$/, 'Color code must be alphabetic, e.g. BLK')
    .transform((value) => value.toUpperCase())
    .meta({
      description: 'Short alphabetic color code used in the SKU (uppercased automatically)',
      examples: ['BLK'],
    }),
  size: z
    .string()
    .trim()
    .min(1)
    .max(12)
    .transform((value) => value.toUpperCase())
    .meta({
      description: 'Size label used in the SKU (uppercased automatically)',
      examples: ['XL'],
    }),
  costPrice: z.coerce
    .number()
    .positive()
    .max(1_000_000)
    .meta({
      description: 'Unit cost price; embedded in the SKU and used for margin calculation',
      examples: [130],
    }),
  initialStock: z.coerce
    .number()
    .int()
    .min(0)
    .default(0)
    .meta({
      description: 'Opening stock; logged as an INWARD entry when greater than zero',
      examples: [50],
    }),
  samplePhotoUrl: z
    .string()
    .url()
    .optional()
    .nullable()
    .meta({ examples: ['https://cdn.example.com/kurti-black.jpg'] }),
  status: z.enum(VariantStatus).default(VariantStatus.ACTIVE),
});

export const variantIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const upsertPricingSchema = z.object({
  channelName: z.enum(SalesChannel).meta({ description: 'Sales channel to price for' }),
  sellingPrice: z.coerce
    .number()
    .positive()
    .max(10_000_000)
    .meta({
      description:
        'Listed price on the channel; margin is computed as this minus variant cost price',
      examples: [399],
    }),
});

export const adjustStockSchema = z.object({
  quantityChange: z.coerce
    .number()
    .int()
    .refine((value) => value !== 0, 'quantityChange must be a non-zero integer')
    .meta({
      description: 'Signed stock delta. INWARD/RETURN require positive, SALE requires negative.',
      examples: [-10],
    }),
  reason: z.enum(StockLogReason).meta({ description: 'Audit reason for the movement' }),
  channel: z
    .string()
    .trim()
    .min(1)
    .max(60)
    .optional()
    .nullable()
    .meta({
      description: 'Optional sales channel the movement is attributed to',
      examples: ['MEESHO'],
    }),
});

export const productVariantResponseSchema = z.object({
  id: z.number(),
  sku: z.string(),
  colorName: z.string(),
  colorCode: z.string(),
  size: z.string(),
  costPrice: z.number(),
  stockQuantity: z.number(),
  samplePhotoUrl: z.string().nullable(),
  status: z.enum(VariantStatus),
  designId: z.number(),
});

export const channelPricingResponseSchema = z.object({
  id: z.number(),
  channelName: z.enum(SalesChannel),
  sellingPrice: z.number(),
  margin: z
    .number()
    .meta({
      description: 'sellingPrice - variant.costPrice, auto-calculated on create and update',
    }),
  variantId: z.number(),
  updatedAt: z.coerce.date(),
});

export const stockLogResponseSchema = z.object({
  id: z.number(),
  variantId: z.number(),
  quantityChange: z.number(),
  reason: z.enum(StockLogReason),
  channel: z.string().nullable(),
  createdAt: z.coerce.date(),
});

export const createVariantResponseSchema = z.object({
  variant: productVariantResponseSchema,
});

export const variantWithPricingsResponseSchema = z.object({
  variant: productVariantResponseSchema.extend({
    pricings: z.array(channelPricingResponseSchema.omit({ updatedAt: true })),
  }),
});

export const upsertPricingResponseSchema = z.object({
  pricing: channelPricingResponseSchema,
});

export const adjustStockResponseSchema = z.object({
  variant: productVariantResponseSchema,
  stockLog: stockLogResponseSchema,
});

export type CreateVariantInput = z.infer<typeof createVariantSchema>;
export type VariantIdParam = z.infer<typeof variantIdParamSchema>;
export type UpsertPricingInput = z.infer<typeof upsertPricingSchema>;
export type AdjustStockInput = z.infer<typeof adjustStockSchema>;
