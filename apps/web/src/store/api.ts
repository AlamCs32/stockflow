import { createApi } from '@reduxjs/toolkit/query/react';
import type { Item } from '@stockflow/shared';
import baseQueryWithReauth from './baseQuery';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Item', 'Design', 'Variant', 'Supplier', 'StockLog', 'User'],
  endpoints: (builder) => ({
    login: builder.mutation<
      { accessToken: string; refreshToken: string; user: { id: string; email: string; name: string } },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<
      { accessToken: string; refreshToken: string; user: { id: string; email: string; name: string } },
      { email: string; password: string; name: string }
    >({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    getMe: builder.query<{ user: { id: string; email: string; name: string } }, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
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

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useGetItemsQuery,
  useGetItemByIdQuery,
} = api;
