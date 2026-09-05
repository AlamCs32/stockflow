import { configureStore } from '@reduxjs/toolkit';
import appReducer from './app/appSlice';
import authReducer from './auth/authSlice';
import { authApi } from './auth/authApi';

export const store = configureStore({
  reducer: {
    app: appReducer,
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(authApi.middleware),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
