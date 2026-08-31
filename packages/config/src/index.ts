const env = process.env.NODE_ENV ?? 'development';

export const config = {
  env,
  isProduction: env === 'production',
  server: {
    host: process.env.HOST ?? '0.0.0.0',
    port: Number(process.env.PORT ?? 3000),
  },
  cors: {
    origin: process.env.CORS_ORIGIN ?? true,
  },
  uploads: {
    dir: process.env.UPLOAD_DIR ?? 'uploads',
    maxFileSize: Number(process.env.UPLOAD_MAX_FILE_SIZE ?? 5 * 1024 * 1024),
  },
  database: {
    type: 'better-sqlite3' as const,
    path: process.env.DB_PATH ?? 'data/database.sqlite',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    migrationsRun: process.env.DB_MIGRATIONS_RUN !== 'false',
    logging: process.env.DB_LOGGING === 'true',
  },
  inventory: {
    lowStockThreshold: Number(process.env.INVENTORY_LOW_STOCK_THRESHOLD ?? 5),
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED !== 'false',
    title: 'My Inventory API',
    description:
      'Multi-channel e-commerce inventory management API for vendors, designs, product variants, channel pricing, and stock control.',
    version: '1.0.0',
    routePrefix: process.env.SWAGGER_ROUTE_PREFIX ?? '/docs',
  },
  logger: {
    level: process.env.LOG_LEVEL ?? (env === 'development' ? 'debug' : 'info'),
    logDir: process.env.LOG_DIR ?? './logs',
    maxFileSize: process.env.LOG_MAX_FILE_SIZE ?? '10M',
    maxFiles: Number(process.env.LOG_MAX_FILES ?? 14),
    prettyPrint: process.env.LOG_PRETTY_PRINT !== 'false',
    redact: {
      headers: ['authorization', 'cookie', 'set-cookie', 'x-api-key'],
      body: [
        'password',
        'newPassword',
        'confirmPassword',
        'token',
        'refreshToken',
        'accessToken',
        'apiKey',
        'secret',
        'creditCard',
        'cvv',
        'ssn',
      ],
    },
  },
} as const;

export type AppConfig = typeof config;
