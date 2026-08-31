import { z } from 'zod';

export const createSupplierSchema = z.object({
  code: z
    .string()
    .regex(/^S\d{3,}$/, 'Supplier code must match pattern S001')
    .transform((value) => value.toUpperCase())
    .meta({
      description: 'Custom supplier code. Auto-generated (S001, S002, ...) when omitted.',
      examples: ['S003'],
    })
    .optional(),
  name: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .meta({ description: 'Supplier display name', examples: ['Surat Fabrics'] }),
  contactEmail: z
    .string()
    .trim()
    .email()
    .meta({
      description: 'Primary contact email, must be unique',
      examples: ['hello@suratfabrics.com'],
    }),
});

export const updateSupplierSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .optional()
    .meta({ description: 'Supplier display name', examples: ['Surat Fabrics'] }),
  contactEmail: z
    .string()
    .trim()
    .email()
    .optional()
    .meta({
      description: 'Primary contact email, must be unique',
      examples: ['hello@suratfabrics.com'],
    }),
});

export const supplierIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const supplierResponseSchema = z.object({
  id: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  contactEmail: z.string(),
  createdAt: z.coerce.date(),
});

export const createSupplierResponseSchema = z.object({ supplier: supplierResponseSchema });

export const updateSupplierResponseSchema = z.object({ supplier: supplierResponseSchema });

export const supplierListResponseSchema = z.object({
  suppliers: z.array(supplierResponseSchema),
  count: z.number(),
});

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
export type SupplierIdParam = z.infer<typeof supplierIdParamSchema>;
