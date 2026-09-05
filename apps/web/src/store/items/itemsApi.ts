import { createApi } from '@reduxjs/toolkit/query/react';
import type { Item } from '@stockflow/shared';
import baseQueryWithReauth from '../baseQuery';

export const itemsApi = createApi({
  reducerPath: 'itemsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Item'],
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

export const { useGetItemsQuery, useGetItemByIdQuery } = itemsApi;
