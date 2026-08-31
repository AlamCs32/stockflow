import 'dotenv/config';
import buildApp from '@/app';
import { config } from '@/configs/index';

const start = async () => {
  const app = await buildApp();

  try {
    await app.listen({ port: config.server.port, host: config.server.host });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
