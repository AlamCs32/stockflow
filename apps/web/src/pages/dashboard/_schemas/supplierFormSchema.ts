import { z } from 'zod';

const supplierCategories = ['GENERAL', 'GARMENT', 'BAGS', 'ELECTRONICS', 'FOOTWEAR'] as const;
const availabilityStatuses = [
  'ALWAYS_AVAILABLE',
  'SEASONAL',
  'CHECK_STOCK',
  'OUT_OF_STOCK',
] as const;

export const supplierFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  contactEmail: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  mobileNo: z
    .string()
    .trim()
    .min(10, 'Mobile must be at least 10 digits')
    .max(15, 'Mobile must be at most 15 digits'),
  category: z.enum(supplierCategories),
  trustScore: z.coerce.number().int().min(0).max(100),
  qualityScore: z.coerce.number().int().min(0).max(100),
  availabilityStatus: z.enum(availabilityStatuses),
  leadTimeDays: z.coerce.number().int().min(0).nullable().optional(),
  address: z.string().trim().max(255).nullable().optional(),
  city: z.string().trim().max(100).nullable().optional(),
  state: z.string().trim().max(100).nullable().optional(),
  gstNumber: z.string().trim().max(20).nullable().optional(),
  panNumber: z.string().trim().max(10).nullable().optional(),
});

export type SupplierFormValues = z.output<typeof supplierFormSchema>;

export const supplierDefaultValues: SupplierFormValues = {
  name: '',
  contactEmail: '',
  mobileNo: '',
  category: 'GENERAL',
  trustScore: 0,
  qualityScore: 0,
  availabilityStatus: 'ALWAYS_AVAILABLE',
  leadTimeDays: null,
  address: null,
  city: null,
  state: null,
  gstNumber: null,
  panNumber: null,
};
