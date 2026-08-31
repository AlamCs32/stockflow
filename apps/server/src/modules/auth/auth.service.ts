import { AppDataSource } from '@/database/data-source';
import { User } from '@/entities/user.entity';
import { RefreshToken } from '@/entities/auth/refresh-token.entity';
import { ConflictError, UnauthorizedError } from '@/shared/errors';
import { hash, compare } from '@node-rs/bcrypt';
import { config } from '@stockflow/config';
import { randomBytes, createHash } from 'node:crypto';
import type { FastifyInstance } from 'fastify';

const userRepository = AppDataSource.getRepository(User);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

function generateRefreshToken(): string {
  return randomBytes(40).toString('hex');
}

export async function register(
  app: FastifyInstance,
  input: {
    tenantId: string;
    email: string;
    password: string;
    fullName: string;
    phone?: string | null;
  }
): Promise<{ user: User; accessToken: string; refreshToken: string }> {
  const existing = await userRepository.findOne({
    where: { tenantId: input.tenantId, email: input.email },
  });
  if (existing) {
    throw new ConflictError('User with this email already exists in this tenant');
  }

  const passwordHash = await hash(input.password, config.auth.bcryptRounds);

  const user = await userRepository.save(
    userRepository.create({
      tenantId: input.tenantId,
      email: input.email,
      passwordHash,
      fullName: input.fullName,
      phone: input.phone ?? null,
    })
  );

  const accessToken = app.jwt.sign(
    { sub: user.id, tenantId: user.tenantId, email: user.email },
    { expiresIn: config.auth.accessTokenTtl }
  );
  const refreshToken = await createRefreshToken(user.id);

  return { user, accessToken, refreshToken };
}

export async function login(
  app: FastifyInstance,
  input: {
    tenantId: string;
    email: string;
    password: string;
  }
): Promise<{ user: User; accessToken: string; refreshToken: string }> {
  const user = await userRepository.findOne({
    where: { tenantId: input.tenantId, email: input.email },
  });
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
  await userRepository.save(user);

  const accessToken = app.jwt.sign(
    { sub: user.id, tenantId: user.tenantId, email: user.email },
    { expiresIn: config.auth.accessTokenTtl }
  );
  const refreshToken = await createRefreshToken(user.id);

  return { user, accessToken, refreshToken };
}

export async function refresh(
  app: FastifyInstance,
  token: string
): Promise<{ user: User; accessToken: string; refreshToken: string }> {
  const tokenHash = sha256(token);
  const existing = await refreshTokenRepository.findOne({
    where: { tokenHash },
    relations: { user: true },
  });

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
  await refreshTokenRepository.save(existing);

  const accessToken = app.jwt.sign(
    { sub: user.id, tenantId: user.tenantId, email: user.email },
    { expiresIn: config.auth.accessTokenTtl }
  );
  const refreshToken = await createRefreshToken(user.id);

  return { user, accessToken, refreshToken };
}

export async function logout(token: string): Promise<void> {
  const tokenHash = sha256(token);
  const existing = await refreshTokenRepository.findOne({ where: { tokenHash } });
  if (existing && !existing.revokedAt) {
    existing.revokedAt = new Date();
    await refreshTokenRepository.save(existing);
  }
}

export async function revokeAllUserTokens(userId: string): Promise<void> {
  await refreshTokenRepository
    .createQueryBuilder()
    .update(RefreshToken)
    .set({ revokedAt: new Date() })
    .where('user_id = :userId', { userId })
    .andWhere('revoked_at IS NULL')
    .execute();
}

export async function getUserWithRoles(userId: string) {
  return userRepository.findOne({
    where: { id: userId },
    relations: { userRoles: { role: { permissions: { module: true } } } },
  });
}

async function createRefreshToken(userId: string): Promise<string> {
  const raw = generateRefreshToken();
  const tokenHash = sha256(raw);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + config.auth.refreshTokenTtlDays);

  await refreshTokenRepository.save(
    refreshTokenRepository.create({
      userId,
      tokenHash,
      expiresAt,
    })
  );

  return raw;
}
