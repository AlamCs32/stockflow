import { pipeline } from 'node:stream/promises';
import { createWriteStream } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { uploadsDir } from '@/plugins/static';

export async function uploadFileHandler(req: FastifyRequest, reply: FastifyReply) {
  const data = await req.file();
  if (!data) {
    return reply.badRequest('No file uploaded');
  }

  const filename = `${randomUUID()}${path.extname(data.filename)}`;
  const destPath = path.join(uploadsDir, filename);

  await pipeline(data.file, createWriteStream(destPath));

  reply.send({ filename, url: `/uploads/${filename}` });
}
