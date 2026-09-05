import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from '../baseQuery';

export interface CategoryFieldDef {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

export interface Category {
  id: number;
  name: string;
  code: string;
  attributesSchema: CategoryFieldDef[];
  createdAt: string;
}

export interface CatalogEntry {
  id: number;
  designCode: string;
  patternCode: string;
  name: string;
  supplierId: string;
  categoryId: number;
  categoryAttributes: Record<string, unknown>;
  createdAt: string;
}

export interface CatalogSupplier {
  id: string;
  code: string;
  name: string;
}

export const catalogApi = createApi({
  reducerPath: 'catalogApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Categories', 'CatalogEntries', 'Suppliers'],
  endpoints: (builder) => ({
    getCategories: builder.query<{ categories: Category[] }, void>({
      query: () => '/catalog/categories',
      providesTags: ['Categories'],
    }),
    getCategoryFields: builder.query<
      { categoryId: number; categoryName: string; fields: CategoryFieldDef[] },
      number
    >({
      query: (id) => `/catalog/categories/${id}/fields`,
    }),
    getSuppliers: builder.query<{ suppliers: CatalogSupplier[] }, void>({
      query: () => '/suppliers',
      providesTags: ['Suppliers'],
    }),
    createCatalogEntry: builder.mutation<
      { design: CatalogEntry },
      {
        designCode: string;
        patternCode: string;
        name: string;
        supplierId: string;
        categoryId: number;
        categoryAttributes?: Record<string, unknown>;
      }
    >({
      query: (body) => ({
        url: '/catalog/entries',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CatalogEntries'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryFieldsQuery,
  useGetSuppliersQuery,
  useCreateCatalogEntryMutation,
} = catalogApi;
