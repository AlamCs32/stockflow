import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import type { IncomingMessage } from 'node:http';
import type { FastifyServerOptions } from 'fastify';
import { config } from '@/configs/index';

const transportPath = fileURLToPath(
  new URL('../../transports/rotating-file.transport.cjs', import.meta.url)
);

const logDir = path.isAbsolute(config.logger.logDir)
  ? config.logger.logDir
  : path.join(process.cwd(), config.logger.logDir);

const fileTransport = (filename: string, level: string) => ({
  target: transportPath,
  options: {
    filename,
    logDir,
    maxFileSize: config.logger.maxFileSize,
    maxFiles: config.logger.maxFiles,
  },
  level,
});

const consoleTarget =
  config.logger.prettyPrint && !config.isProduction
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : {
        target: 'pino/file',
        options: { destination: 1 },
      };

const redactPaths = [
  ...config.logger.redact.headers.map((header) => `req.headers["${header}"]`),
  ...config.logger.redact.body.flatMap((field) => [
    field,
    `*.${field}`,
    `req.body.${field}`,
    `req.body.*.${field}`,
  ]),
];

export function genRequestId(req: IncomingMessage): string {
  return (req.headers['x-request-id'] as string | undefined) ?? randomUUID();
}

export function buildLoggerConfig(): NonNullable<FastifyServerOptions['logger']> {
  return {
    level: config.logger.level,
    redact: {
      paths: redactPaths,
      censor: '[REDACTED]',
    },
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        hostname: req.hostname,
        remoteAddress: req.ip,
        remotePort: req.socket?.remotePort,
        headers: req.headers,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
        responseTime: res.elapsedTime,
      }),
      err: (err) =>
        config.isProduction
          ? {
              type: err.name,
              message: err.message,
              code: err.code,
              stack: '',
            }
          : {
              type: err.name,
              message: err.message,
              code: err.code,
              stack: err.stack ?? '',
            },
    },
    transport: {
      targets: [
        consoleTarget,
        fileTransport('combined', config.logger.level),
        fileTransport('error', 'error'),
      ],
    },
  };
}
