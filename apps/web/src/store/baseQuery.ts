import type {
  BaseQueryApi,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import type { RootState } from './store';

const LOCKED_PATHS = ['/auth/login', '/auth/register', '/auth/forgot-password'];

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

function isFetchArgs(args: string | FetchArgs): args is FetchArgs {
  return typeof args !== 'string';
}

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth?.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

async function baseQueryWithReauth(
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: Record<string, unknown>,
) {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const requestPath = isFetchArgs(args) ? args.url : args;

    if (LOCKED_PATHS.includes(requestPath)) {
      api.dispatch({ type: 'auth/logout' });
      return result;
    }

    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const refreshToken = (api.getState() as RootState).auth?.refreshToken;

        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const refreshResult = await baseQuery(
          {
            url: '/auth/refresh',
            method: 'POST',
            body: { refreshToken },
          },
          api,
          extraOptions,
        );

        if (refreshResult.error) {
          api.dispatch({ type: 'auth/logout' });
          processQueue(refreshResult.error, null);
          return refreshResult;
        }

        const { accessToken, refreshToken: newRefreshToken } = refreshResult.data as {
          accessToken: string;
          refreshToken: string;
        };

        api.dispatch({
          type: 'auth/setTokens',
          payload: { accessToken, refreshToken: newRefreshToken },
        });

        processQueue(null, accessToken);

        result = await baseQuery(args, api, extraOptions);
      } catch (error) {
        processQueue(error, null);
        api.dispatch({ type: 'auth/logout' });
        return { error: { status: 'CUSTOM_ERROR', error: 'Token refresh failed' } as FetchBaseQueryError };
      } finally {
        isRefreshing = false;
      }
    } else {
      result = await new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => baseQuery(args, api, extraOptions))
        .catch((error) => ({
          error: { status: 'CUSTOM_ERROR', error: error as string } as FetchBaseQueryError,
        }));
    }
  }

  return result;
}

export default baseQueryWithReauth;
