import { z } from 'zod';
import { SupplierCategory, AvailabilityStatus } from '@/entities/supplier.entity';

const supplierCategoryEnum = z.enum(SupplierCategory);
const availabilityStatusEnum = z.enum(AvailabilityStatus);

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
  contactEmail: z.email().meta({
    description: 'Primary contact email, must be unique',
    examples: ['hello@suratfabrics.com'],
  }),
  mobileNo: z
    .string()
    .trim()
    .min(10)
    .max(15)
    .meta({ description: 'Primary mobile number', examples: ['9876543210'] }),
  category: supplierCategoryEnum.default(SupplierCategory.GENERAL).meta({
    description: 'Category of goods the supplier deals in',
    examples: ['GARMENT', 'BAGS', 'ELECTRONICS'],
  }),
  trustScore: z
    .number()
    .int()
    .min(0)
    .max(100)
    .default(0)
    .meta({ description: 'Trust score 0-100', examples: [85] }),
  qualityScore: z
    .number()
    .int()
    .min(0)
    .max(100)
    .default(0)
    .meta({ description: 'Quality score 0-100', examples: [90] }),
  availabilityStatus: availabilityStatusEnum.default(AvailabilityStatus.ALWAYS_AVAILABLE).meta({
    description: 'Stock availability status',
    examples: ['ALWAYS_AVAILABLE', 'SEASONAL', 'CHECK_STOCK'],
  }),
  leadTimeDays: z
    .number()
    .int()
    .min(0)
    .nullable()
    .default(null)
    .optional()
    .meta({ description: 'Typical lead time in days', examples: [7] }),
  address: z
    .string()
    .trim()
    .max(255)
    .nullable()
    .default(null)
    .optional()
    .meta({ description: 'Physical address', examples: ['123 Textile Market, Surat'] }),
  city: z
    .string()
    .trim()
    .max(100)
    .nullable()
    .default(null)
    .optional()
    .meta({ description: 'City', examples: ['Surat'] }),
  state: z
    .string()
    .trim()
    .max(100)
    .nullable()
    .default(null)
    .optional()
    .meta({ description: 'State', examples: ['Gujarat'] }),
  gstNumber: z
    .string()
    .trim()
    .max(20)
    .nullable()
    .default(null)
    .optional()
    .meta({ description: 'GST registration number', examples: ['24AAACB1234F1Z5'] }),
  panNumber: z
    .string()
    .trim()
    .max(10)
    .nullable()
    .default(null)
    .optional()
    .meta({ description: 'PAN card number', examples: ['AAACB1234F'] }),
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
    .email()
    .optional()
    .meta({
      description: 'Primary contact email, must be unique',
      examples: ['hello@suratfabrics.com'],
    }),
  mobileNo: z
    .string()
    .trim()
    .min(10)
    .max(15)
    .optional()
    .meta({ description: 'Primary mobile number', examples: ['9876543210'] }),
  category: supplierCategoryEnum.optional(),
  trustScore: z.number().int().min(0).max(100).optional(),
  qualityScore: z.number().int().min(0).max(100).optional(),
  availabilityStatus: availabilityStatusEnum.optional(),
  leadTimeDays: z.number().int().min(0).nullable().optional(),
  address: z.string().trim().max(255).nullable().optional(),
  city: z.string().trim().max(100).nullable().optional(),
  state: z.string().trim().max(100).nullable().optional(),
  gstNumber: z.string().trim().max(20).nullable().optional(),
  panNumber: z.string().trim().max(10).nullable().optional(),
});

export const supplierIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const supplierResponseSchema = z.object({
  id: z.uuid(),
  code: z.string(),
  name: z.string(),
  contactEmail: z.email(),
  mobileNo: z.string(),
  category: supplierCategoryEnum,
  trustScore: z.number(),
  qualityScore: z.number(),
  availabilityStatus: availabilityStatusEnum,
  leadTimeDays: z.number().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  gstNumber: z.string().nullable(),
  panNumber: z.string().nullable(),
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
