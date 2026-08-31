import type { FastifyInstance } from 'fastify';
import { initializeDatabase } from '@/database/data-source';

declare module 'fastify' {
  interface FastifyInstance {
    db: Awaited<ReturnType<typeof initializeDatabase>>;
  }
}

export default async function registerDatabase(app: FastifyInstance) {
  app.decorate('db', await initializeDatabase());

  app.addHook('onClose', async () => {
    await app.db.destroy();
  });
}
