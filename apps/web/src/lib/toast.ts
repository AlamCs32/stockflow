import { toast } from '@/components/ui/sonner';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface ApiError {
  statusCode: number;
  error: string;
  message: string;
  details?: Record<string, string[]>;
}

function getErrorMessage(error: unknown): string {
  if (!error) return 'An unexpected error occurred';

  if (typeof error === 'string') return error;

  if (error instanceof Error) return error.message;

  const apiError = error as FetchBaseQueryError;

  if (apiError.data) {
    const data = apiError.data as ApiError;
    if (data.message) return data.message;
    if (data.error) return data.error;
  }

  if (apiError.status === 'FETCH_ERROR') return 'Network error. Please check your connection.';
  if (apiError.status === 'TIMEOUT_ERROR') return 'Request timed out. Please try again.';
  if (apiError.status === 'PARSING_ERROR') return 'Invalid response from server.';

  return `Error: ${apiError.status}`;
}

function getValidationErrors(error: unknown): Record<string, string[]> | null {
  if (!error) return null;

  const apiError = error as FetchBaseQueryError;

  if (apiError.data) {
    const data = apiError.data as ApiError;
    return data.details ?? null;
  }

  return null;
}

export const toastHelper = {
  success: (message: string, description?: string) => {
    toast.success(message, { description });
  },

  error: (error: unknown, fallback = 'Operation failed') => {
    const message = getErrorMessage(error) ?? fallback;
    toast.error(message);
  },

  warning: (message: string, description?: string) => {
    toast.warning(message, { description });
  },

  info: (message: string, description?: string) => {
    toast.info(message, { description });
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  promise: <T,>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    },
  ) => {
    return toast.promise(promise, options);
  },

  validation: (error: unknown) => {
    const errors = getValidationErrors(error);
    if (errors) {
      Object.entries(errors).forEach(([, messages]) => {
        messages.forEach((message) => {
          toast.error(message);
        });
      });
    } else {
      toastHelper.error(error);
    }
  },

  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId);
  },
};
