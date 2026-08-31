import { z } from 'zod';

export const createDesignSchema = z.object({
  designCode: z
    .string()
    .trim()
    .regex(/^[A-Za-z]\d{2,}$/, 'Design code must match pattern D001')
    .transform((value) => value.toUpperCase())
    .meta({ description: 'Unique design code (uppercased automatically)', examples: ['D001'] }),
  patternCode: z.string().trim().min(1).max(32).meta({ description: 'Internal pattern reference', examples: ['PAT-BLK-FLR'] }),
  name: z.string().trim().min(1).max(160).meta({ examples: ['Floral Print Anarkali Kurti'] }),
  vendorId: z.string().trim().min(1).meta({ description: 'Existing vendor identifier', examples: ['V001'] }),
  categoryId: z.coerce.number().int().positive().meta({ description: 'Existing category id', examples: [3] }),
});

export const designResponseSchema = z.object({
  id: z.number(),
  designCode: z.string(),
  patternCode: z.string(),
  name: z.string(),
  vendorId: z.string(),
  categoryId: z.number(),
  createdAt: z.coerce.date(),
});

export const createDesignResponseSchema = z.object({ design: designResponseSchema });

export type CreateDesignInput = z.infer<typeof createDesignSchema>;
