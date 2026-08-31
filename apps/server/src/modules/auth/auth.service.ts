import { AppDataSource } from '@/database/data-source';
import { User } from '@/entities/user.entity';
import { RefreshToken } from '@/entities/auth/refresh-token.entity';
import { ConflictError, UnauthorizedError } from '@/shared/errors';
import { hash, compare } from '@node-rs/bcrypt';
import { config } from '@stockflow/config';
import { generateRefreshToken, hashToken, getRefreshTokenExpiry } from './auth.token';
import { LoginInput, RefreshInput, RegisterInput } from './auth.schema';

const userRepository = AppDataSource.getRepository(User);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

export type SignToken = (payload: { sub: string; email: string }) => string;

export interface AuthResult {
  user: {
    id: string;
    isActive: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

function toUserResponse(user: User): AuthResult['user'] {
  return {
    id: user.id,
    isActive: user.isActive,
  };
}

export async function register(input: RegisterInput, signToken: SignToken): Promise<AuthResult> {
  const existing = await userRepository.findOne({
    where: { email: input.email },
  });
  if (existing) {
    throw new ConflictError('User with this email already exists');
  }

  const passwordHash = await hash(input.password, config.auth.bcryptRounds);

  const user = await userRepository.save(
    userRepository.create({
      email: input.email,
      passwordHash,
      fullName: input.fullName,
      phone: input.phone ?? null,
    })
  );

  const accessToken = signToken({ sub: user.id, email: user.email });
  const refreshToken = await createRefreshToken(user.id);

  return { user: toUserResponse(user), accessToken, refreshToken };
}

export async function login(input: LoginInput, signToken: SignToken): Promise<AuthResult> {
  const user = await userRepository.findOne({
    where: { email: input.email },
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

  const accessToken = signToken({ sub: user.id, email: user.email });
  const refreshToken = await createRefreshToken(user.id);

  return { user: toUserResponse(user), accessToken, refreshToken };
}

export async function refresh(input: RefreshInput, signToken: SignToken): Promise<AuthResult> {
  const tokenHash = hashToken(input.refreshToken);
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

  const accessToken = signToken({ sub: user.id, email: user.email });
  const refreshToken = await createRefreshToken(user.id);

  return { user: toUserResponse(user), accessToken, refreshToken };
}

export async function logout(token: string): Promise<void> {
  const tokenHash = hashToken(token);
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
  const tokenHash = hashToken(raw);
  const expiresAt = getRefreshTokenExpiry();

  await refreshTokenRepository.save(
    refreshTokenRepository.create({
      userId,
      tokenHash,
      expiresAt,
    })
  );

  return raw;
}
