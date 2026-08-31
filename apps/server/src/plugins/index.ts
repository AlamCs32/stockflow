import type { FastifyInstance } from 'fastify';
import registerCors from './cors';
import registerDatabase from './database';
import registerHelmet from './helmet';
import registerRateLimit from './rate-limit';
import registerSensible from './sensible';
import registerMultipart from './multipart';
import registerStatic from './static';
import registerSwagger from './swagger';

export default async function registerPlugins(app: FastifyInstance) {
  await registerHelmet(app);
  await registerCors(app);
  await registerSensible(app);
  await registerRateLimit(app);
  await registerMultipart(app);
  await registerStatic(app);
  await registerDatabase(app);
  await registerSwagger(app);
}
