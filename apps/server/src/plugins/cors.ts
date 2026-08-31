import type { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { config } from '@/configs/index';

export default async function registerCors(app: FastifyInstance) {
  await app.register(cors, {
    origin: config.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // 24 hours
    preflightContinue: false,
  });
}
