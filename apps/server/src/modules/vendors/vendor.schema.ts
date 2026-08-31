import { z } from 'zod';

export const createVendorSchema = z.object({
  id: z
    .string()
    .regex(/^V\d{3,}$/, 'Vendor id must match pattern V001')
    .meta({
      description: 'Custom vendor identifier. Auto-generated (V001, V002, ...) when omitted.',
      examples: ['V003'],
    })
    .optional(),
  name: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .meta({ description: 'Vendor display name', examples: ['Surat Fabrics'] }),
  contactEmail: z
    .string()
    .trim()
    .email()
    .meta({
      description: 'Primary contact email, must be unique',
      examples: ['hello@suratfabrics.com'],
    }),
});

export const vendorResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  contactEmail: z.string(),
  createdAt: z.coerce.date(),
});

export const createVendorResponseSchema = z.object({ vendor: vendorResponseSchema });

export type CreateVendorInput = z.infer<typeof createVendorSchema>;
