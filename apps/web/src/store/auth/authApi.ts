import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from '../baseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation<
      {
        accessToken: string;
        refreshToken: string;
        user: { id: string; email: string; name: string };
      },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<
      {
        accessToken: string;
        refreshToken: string;
        user: { id: string; email: string; name: string };
      },
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
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;
