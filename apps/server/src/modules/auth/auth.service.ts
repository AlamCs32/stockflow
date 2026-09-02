import { ConflictError, UnauthorizedError } from '@/shared/errors';
import { hash, compare } from '@node-rs/bcrypt';
import { config } from '@stockflow/config';
import { generateRefreshToken, hashToken, getRefreshTokenExpiry } from './auth.token';
import type { LoginInput, RefreshInput, RegisterInput } from './auth.schema';
import {
  findUserByEmail,
  findUserWithRoles,
  createUser,
  saveUser,
} from '@/repositories/user.repository';
import {
  findRefreshTokenByHash,
  createRefreshToken,
  saveRefreshToken,
  revokeAllUserTokens as revokeAll,
} from '@/repositories/refresh-token.repository';

export type SignToken = (payload: { sub: string; email: string }) => string;

export interface AuthResult {
  user: {
    id: string;
    isActive: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

function toUserResponse(user: { id: string; isActive: boolean }): AuthResult['user'] {
  return {
    id: user.id,
    isActive: user.isActive,
  };
}

export async function register(input: RegisterInput, signToken: SignToken): Promise<AuthResult> {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new ConflictError('User with this email already exists');
  }

  const passwordHash = await hash(input.password, config.auth.bcryptRounds);

  const user = await createUser({
    email: input.email,
    passwordHash,
    fullName: input.fullName,
    phone: input.phone ?? null,
  });

  const accessToken = signToken({ sub: user.id, email: user.email });
  const refreshToken = await createRefreshTokenEntry(user.id);

  return { user: toUserResponse(user), accessToken, refreshToken };
}

export async function login(input: LoginInput, signToken: SignToken): Promise<AuthResult> {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('Account is deactivated');
  }

  const valid = await compare(input.password, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  user.lastLoginAt = new Date();
  await saveUser(user);

  const accessToken = signToken({ sub: user.id, email: user.email });
  const refreshToken = await createRefreshTokenEntry(user.id);

  return { user: toUserResponse(user), accessToken, refreshToken };
}

export async function refresh(input: RefreshInput, signToken: SignToken): Promise<AuthResult> {
  const tokenHash = hashToken(input.refreshToken);
  const existing = await findRefreshTokenByHash(tokenHash);

  if (!existing || existing.revokedAt) {
    throw new UnauthorizedError('Invalid or revoked refresh token');
  }

  if (new Date() > existing.expiresAt) {
    throw new UnauthorizedError('Refresh token expired');
  }

  const user = existing.user!;
  if (!user.isActive) {
    throw new UnauthorizedError('Account is deactivated');
  }

  existing.revokedAt = new Date();
  await saveRefreshToken(existing);

  const accessToken = signToken({ sub: user.id, email: user.email });
  const refreshToken = await createRefreshTokenEntry(user.id);

  return { user: toUserResponse(user), accessToken, refreshToken };
}

export async function logout(token: string): Promise<void> {
  const tokenHash = hashToken(token);
  const existing = await findRefreshTokenByHash(tokenHash);
  if (existing && !existing.revokedAt) {
    existing.revokedAt = new Date();
    await saveRefreshToken(existing);
  }
}

export async function revokeAllUserTokens(userId: string): Promise<void> {
  await revokeAll(userId);
}

export async function getUserWithRoles(userId: string) {
  return findUserWithRoles(userId);
}

async function createRefreshTokenEntry(userId: string): Promise<string> {
  const raw = generateRefreshToken();
  const tokenHash = hashToken(raw);
  const expiresAt = getRefreshTokenExpiry();

  await createRefreshToken({
    userId,
    tokenHash,
    expiresAt,
  });

  return raw;
}
