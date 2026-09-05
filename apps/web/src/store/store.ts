import { configureStore } from '@reduxjs/toolkit';
import appReducer from './app/appSlice';
import authReducer from './auth/authSlice';
import { authApi } from './auth/authApi';
import { catalogApi } from './catalog/catalogApi';
import { supplierApi } from './supplier/supplierApi';

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [catalogApi.reducerPath]: catalogApi.reducer,
    [supplierApi.reducerPath]: supplierApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(authApi.middleware, catalogApi.middleware, supplierApi.middleware),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
