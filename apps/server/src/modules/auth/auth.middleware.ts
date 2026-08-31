import { getUserWithRoles } from '@/modules/auth/auth.service';
import { UnauthorizedError, ForbiddenError } from '@/shared/errors';
import type { FastifyRequest, FastifyReply } from 'fastify';

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthContext {
  user: AuthUser;
  permissions: Record<
    string,
    { canRead: boolean; canWrite: boolean; canUpdate: boolean; canDelete: boolean }
  >;
}

declare module 'fastify' {
  interface FastifyRequest {
    auth?: AuthContext;
  }
}

export async function authenticate(req: FastifyRequest, _reply: FastifyReply): Promise<void> {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') ?? '';
    const decoded = req.server.jwt.verify<{
      sub: string;
      email: string;
    }>(token) as { sub: string; email: string };

    const userWithRoles = await getUserWithRoles(decoded.sub);
    if (!userWithRoles) {
      throw new UnauthorizedError('User not found');
    }

    if (!userWithRoles.isActive) {
      throw new UnauthorizedError('Account is deactivated');
    }

    const permissions: AuthContext['permissions'] = {};
    for (const ur of userWithRoles.userRoles ?? []) {
      if (!ur.role?.isActive) continue;
      for (const rp of ur.role.permissions ?? []) {
        if (!rp.module?.isActive) continue;
        const key = rp.module.key;
        if (!permissions[key]) {
          permissions[key] = {
            canRead: false,
            canWrite: false,
            canUpdate: false,
            canDelete: false,
          };
        }
        permissions[key].canRead = permissions[key].canRead || rp.canRead;
        permissions[key].canWrite = permissions[key].canWrite || rp.canWrite;
        permissions[key].canUpdate = permissions[key].canUpdate || rp.canUpdate;
        permissions[key].canDelete = permissions[key].canDelete || rp.canDelete;
      }
    }

    req.auth = {
      user: {
        id: decoded.sub,
        email: decoded.email,
      },
      permissions,
    };
  } catch {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

export function requirePermission(
  moduleKey: string,
  action: 'canRead' | 'canWrite' | 'canUpdate' | 'canDelete'
) {
  return async (req: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    if (!req.auth) {
      throw new UnauthorizedError('Authentication required');
    }

    const mod = req.auth.permissions[moduleKey];
    if (!mod || !mod[action]) {
      throw new ForbiddenError(`Insufficient permissions: ${moduleKey}.${action}`);
    }
  };
}
