import type { FastifyReply, FastifyRequest } from 'fastify';
import { register, login, refresh, logout } from './auth.service';
import type { RegisterInput, LoginInput, RefreshInput, LogoutInput } from './auth.schema';

export async function postRegisterHandler(
  req: FastifyRequest<{ Body: RegisterInput }>,
  reply: FastifyReply
) {
  const result = await register(req.server, req.body);
  reply.code(201).send({
    user: result.user,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
}

export async function postLoginHandler(
  req: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) {
  const result = await login(req.server, req.body);
  reply.send({
    user: result.user,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
}

export async function postRefreshHandler(
  req: FastifyRequest<{ Body: RefreshInput }>,
  reply: FastifyReply
) {
  const result = await refresh(req.server, req.body.refreshToken);
  reply.send({
    user: result.user,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
}

export async function postLogoutHandler(
  req: FastifyRequest<{ Body: LogoutInput }>,
  reply: FastifyReply
) {
  await logout(req.body.refreshToken);
  reply.send({ message: 'Logged out successfully' });
}
