import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from '../baseQuery';

export type SupplierCategory = 'GENERAL' | 'GARMENT' | 'BAGS' | 'ELECTRONICS' | 'FOOTWEAR';
export type AvailabilityStatus =
  | 'ALWAYS_AVAILABLE'
  | 'SEASONAL'
  | 'CHECK_STOCK'
  | 'OUT_OF_STOCK';

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactEmail: string;
  mobileNo: string;
  category: SupplierCategory;
  trustScore: number;
  qualityScore: number;
  availabilityStatus: AvailabilityStatus;
  leadTimeDays: number | null;
  address: string | null;
  city: string | null;
  state: string | null;
  gstNumber: string | null;
  panNumber: string | null;
  createdAt: string;
}

export interface CreateSupplierInput {
  code?: string;
  name: string;
  contactEmail: string;
  mobileNo: string;
  category?: SupplierCategory;
  trustScore?: number;
  qualityScore?: number;
  availabilityStatus?: AvailabilityStatus;
  leadTimeDays?: number | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  gstNumber?: string | null;
  panNumber?: string | null;
}

export type UpdateSupplierInput = Partial<CreateSupplierInput>;

export const supplierApi = createApi({
  reducerPath: 'supplierApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Suppliers'],
  endpoints: (builder) => ({
    getSuppliers: builder.query<{ suppliers: Supplier[]; count: number }, void>({
      query: () => '/suppliers',
      providesTags: ['Suppliers'],
    }),
    getSupplier: builder.query<{ supplier: Supplier }, string>({
      query: (id) => `/suppliers/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Suppliers', id }],
    }),
    createSupplier: builder.mutation<{ supplier: Supplier }, CreateSupplierInput>({
      query: (body) => ({
        url: '/suppliers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Suppliers'],
    }),
    updateSupplier: builder.mutation<
      { supplier: Supplier },
      { id: string; body: UpdateSupplierInput }
    >({
      query: ({ id, body }) => ({
        url: `/suppliers/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Suppliers'],
    }),
    deleteSupplier: builder.mutation<void, string>({
      query: (id) => ({
        url: `/suppliers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Suppliers'],
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useGetSupplierQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = supplierApi;
