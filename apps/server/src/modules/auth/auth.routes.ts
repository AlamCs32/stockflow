import type { FastifyInstance } from 'fastify';
import {
  postRegisterHandler,
  postLoginHandler,
  postRefreshHandler,
  postLogoutHandler,
} from './auth.controller';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  logoutSchema,
  authResponseSchema,
  messageResponseSchema,
} from './auth.schema';

export default async function authRoutes(app: FastifyInstance) {
  app.post(
    '/api/auth/register',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Register a new user',
        description: 'Creates a new user account within a tenant.',
        body: registerSchema,
        response: { 201: authResponseSchema },
      },
    },
    postRegisterHandler
  );

  app.post(
    '/api/auth/login',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Login with email and password',
        description: 'Returns access and refresh tokens on success.',
        body: loginSchema,
        response: { 200: authResponseSchema },
      },
    },
    postLoginHandler
  );

  app.post(
    '/api/auth/refresh',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Refresh access token',
        description: 'Exchange a valid refresh token for new access and refresh tokens.',
        body: refreshSchema,
        response: { 200: authResponseSchema },
      },
    },
    postRefreshHandler
  );

  app.post(
    '/api/auth/logout',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Logout and revoke refresh token',
        description: 'Revokes the provided refresh token.',
        body: logoutSchema,
        response: { 200: messageResponseSchema },
      },
    },
    postLogoutHandler
  );
}
