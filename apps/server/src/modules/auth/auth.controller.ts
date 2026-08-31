import type { FastifyReply, FastifyRequest } from 'fastify';
import { register, login, refresh, logout } from './auth.service';
import type { RegisterInput, LoginInput, RefreshInput, LogoutInput } from './auth.schema';
import type { SignToken } from './auth.service';
import { config } from '@stockflow/config';

function createSignToken(app: FastifyRequest['server']): SignToken {
  return (payload) => app.jwt.sign(payload, { expiresIn: config.auth.accessTokenTtl });
}

export async function postRegisterHandler(
  req: FastifyRequest<{ Body: RegisterInput }>,
  reply: FastifyReply
) {
  const result = await register(req.body, createSignToken(req.server));
  reply.code(201).send(result);
}

export async function postLoginHandler(
  req: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) {
  const result = await login(req.body, createSignToken(req.server));
  reply.send(result);
}

export async function postRefreshHandler(
  req: FastifyRequest<{ Body: RefreshInput }>,
  reply: FastifyReply
) {
  const result = await refresh(req.body, createSignToken(req.server));
  reply.send(result);
}

export async function postLogoutHandler(
  req: FastifyRequest<{ Body: LogoutInput }>,
  reply: FastifyReply
) {
  await logout(req.body.refreshToken);
  reply.send({ message: 'Logged out successfully' });
}
