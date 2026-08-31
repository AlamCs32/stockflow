import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import { ZodError } from 'zod';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import registerPlugins from '@/plugins/index';
import registerRoutes from '@/routes/index';
import { buildLoggerConfig, genRequestId } from '@/configs/logger';
import { AppError } from '@/shared/errors';
import { config } from '@stockflow/config';

export default async function buildApp() {
  const app = Fastify({ logger: buildLoggerConfig(), genReqId: genRequestId });

  await app.register(jwt, {
    secret: config.auth.jwtAccessSecret,
    sign: { expiresIn: config.auth.accessTokenTtl },
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.setErrorHandler((error, req, reply) => {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({
        statusCode: error.statusCode,
        error: error.name,
        message: error.message,
        details: error.details,
      });
    }

    if (error instanceof ZodError) {
      return reply.code(400).send({
        statusCode: 400,
        error: 'ValidationError',
        message: 'Request validation failed',
        details: error.issues,
      });
    }

    if (error.validation) {
      return reply.code(error.statusCode ?? 400).send({
        statusCode: error.statusCode ?? 400,
        error: 'ValidationError',
        message: error.message,
        details: error.validation,
      });
    }

    req.log.error(error);
    const statusCode = error.statusCode ?? 500;
    return reply.code(statusCode).send({
      statusCode,
      error: error.name,
      message: statusCode < 500 ? error.message : 'Internal server error',
    });
  });

  await registerPlugins(app);
  await registerRoutes(app);

  return app;
}
