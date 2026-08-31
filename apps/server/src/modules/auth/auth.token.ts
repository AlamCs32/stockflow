import { randomBytes, createHash } from 'node:crypto';
import { config } from '@stockflow/config';

export function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

export function generateRefreshToken(): string {
  return randomBytes(40).toString('hex');
}

export function hashToken(token: string): string {
  return sha256(token);
}

export function getRefreshTokenExpiry(): Date {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + config.auth.refreshTokenTtlDays);
  return expiresAt;
}
