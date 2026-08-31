import type { HealthResponse } from './health.types';

export function getHealth(): HealthResponse {
  return { status: 'ok', timestamp: new Date().toISOString() };
}
