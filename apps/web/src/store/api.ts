import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Item } from '@stockflow/shared';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Item', 'Design', 'Variant', 'Supplier', 'StockLog'],
  endpoints: (builder) => ({
    getItems: builder.query<{ items: Item[]; count: number }, void>({
      query: () => '/items',
      providesTags: ['Item'],
    }),
    getItemById: builder.query<{ entity: Item }, string>({
      query: (id) => `/items/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Item', id }],
    }),
  }),
});

export const { useGetItemsQuery, useGetItemByIdQuery } = api;
