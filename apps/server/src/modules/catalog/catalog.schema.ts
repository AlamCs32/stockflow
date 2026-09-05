import { z } from 'zod';

const categoryFieldDefSchema = z.object({
  name: z.string().min(1).max(60),
  label: z.string().min(1).max(100),
  type: z.enum(['text', 'number', 'select', 'textarea']),
  required: z.boolean().optional().default(false),
  options: z.array(z.string()).optional(),
  placeholder: z.string().optional(),
});

export const categoryResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  attributesSchema: z.array(categoryFieldDefSchema),
  createdAt: z.coerce.date(),
});

export const categoryListResponseSchema = z.object({
  categories: z.array(categoryResponseSchema),
});

export const categoryIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const categoryFieldsResponseSchema = z.object({
  categoryId: z.number(),
  categoryName: z.string(),
  fields: z.array(categoryFieldDefSchema),
});

export const createCatalogEntrySchema = z.object({
  designCode: z
    .string()
    .trim()
    .regex(/^[A-Za-z]\d{2,}$/, 'Design code must match pattern D001')
    .transform((value) => value.toUpperCase())
    .meta({ description: 'Unique design code', examples: ['D001'] }),
  patternCode: z
    .string()
    .trim()
    .min(1)
    .max(32)
    .meta({ description: 'Internal pattern reference', examples: ['PAT-BLK-FLR'] }),
  name: z
    .string()
    .trim()
    .min(1)
    .max(160)
    .meta({ examples: ['Floral Print Anarkali Kurti'] }),
  supplierId: z
    .string()
    .trim()
    .min(1)
    .meta({ description: 'Existing supplier UUID', examples: ['a1b2c3d4-...'] }),
  categoryId: z.coerce
    .number()
    .int()
    .positive()
    .meta({ description: 'Category ID to get attribute schema from', examples: [1] }),
  categoryAttributes: z
    .record(z.string(), z.unknown())
    .optional()
    .default({})
    .meta({ description: 'Category-specific field values matching the category attributesSchema' }),
});

export const catalogEntryResponseSchema = z.object({
  design: z.object({
    id: z.number(),
    designCode: z.string(),
    patternCode: z.string(),
    name: z.string(),
    supplierId: z.string(),
    categoryId: z.number(),
    categoryAttributes: z.record(z.string(), z.unknown()),
    createdAt: z.coerce.date(),
  }),
});

export const catalogEntryListResponseSchema = z.object({
  designs: z.array(
    z.object({
      id: z.number(),
      designCode: z.string(),
      patternCode: z.string(),
      name: z.string(),
      supplierId: z.string(),
      categoryId: z.number(),
      categoryAttributes: z.record(z.string(), z.unknown()),
      createdAt: z.coerce.date(),
    })
  ),
  count: z.number(),
});

export type CategoryFieldDef = z.infer<typeof categoryFieldDefSchema>;
export type CreateCatalogEntryInput = z.infer<typeof createCatalogEntrySchema>;
