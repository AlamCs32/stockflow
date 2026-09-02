import { AppDataSource } from '@/database/data-source';
import { RefreshToken } from '@/entities/auth/refresh-token.entity';

export const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

export async function findRefreshTokenByHash(tokenHash: string): Promise<RefreshToken | null> {
  return refreshTokenRepository.findOne({
    where: { tokenHash },
    relations: { user: true },
  });
}

export async function findRefreshTokenById(id: string): Promise<RefreshToken | null> {
  return refreshTokenRepository.findOne({ where: { id } });
}

export async function createRefreshToken(data: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}): Promise<RefreshToken> {
  const token = refreshTokenRepository.create(data);
  return refreshTokenRepository.save(token);
}

export async function saveRefreshToken(token: RefreshToken): Promise<RefreshToken> {
  return refreshTokenRepository.save(token);
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
