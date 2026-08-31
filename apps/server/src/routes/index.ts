import type { FastifyInstance } from 'fastify';
import healthRoutes from '@/modules/health/health.routes';
import itemRoutes from '@/modules/items/item.routes';
import uploadRoutes from '@/modules/upload/upload.routes';
import supplierRoutes from '@/modules/suppliers/supplier.routes';
import designRoutes from '@/modules/designs/design.routes';
import variantRoutes from '@/modules/variants/variant.routes';
import inventoryRoutes from '@/modules/inventory/inventory.routes';
import authRoutes from '@/modules/auth/auth.routes';

export default async function registerRoutes(app: FastifyInstance) {
  await app.register(authRoutes);
  await app.register(healthRoutes);
  await app.register(itemRoutes);
  await app.register(uploadRoutes);
  await app.register(supplierRoutes);
  await app.register(designRoutes);
  await app.register(variantRoutes);
  await app.register(inventoryRoutes);
}
