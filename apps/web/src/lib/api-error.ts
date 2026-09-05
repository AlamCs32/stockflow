import { toastHelper } from '@/lib/toast';

interface ApiErrorBody {
  statusCode: number;
  error: string;
  message: string;
  details?: Record<string, string[]> | Array<{ path: string[]; message: string }>;
}

export function getErrorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') return undefined;
  const e = error as Record<string, unknown>;
  if (typeof e.status === 'number') return e.status;
  return undefined;
}

export function getErrorBody(error: unknown): ApiErrorBody | null {
  if (!error || typeof error !== 'object') return null;
  const e = error as Record<string, unknown>;
  const data = e.data;
  if (data && typeof data === 'object' && 'message' in data) {
    return data as ApiErrorBody;
  }
  return null;
}

export function handleMutationError(error: unknown, fallback = 'Operation failed') {
  const body = getErrorBody(error);

  if (body?.details) {
    toastHelper.validation(error);
    return;
  }

  toastHelper.error(error, fallback);
}
