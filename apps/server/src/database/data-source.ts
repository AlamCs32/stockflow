import 'reflect-metadata';
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DataSource } from 'typeorm';
import { config } from '@stockflow/config';
import { User } from '../entities/user.entity';
import { RefreshToken } from '../entities/auth/refresh-token.entity';
import { Role } from '../entities/auth/role.entity';
import { UserRole } from '../entities/auth/user-role.entity';
import { Module } from '../entities/auth/module.entity';
import { RolePermission } from '../entities/auth/role-permission.entity';
import { Category } from '../entities/category.entity';
import { Supplier } from '../entities/supplier.entity';
import { Design } from '../entities/design.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { ChannelPricing } from '../entities/channel-pricing.entity';
import { StockLog } from '../entities/stock-log.entity';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const AppDataSource = new DataSource({
  type: config.database.type,
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  entities: [
    User,
    RefreshToken,
    Role,
    UserRole,
    Module,
    RolePermission,
    Category,
    Supplier,
    Design,
    ProductVariant,
    ChannelPricing,
    StockLog,
  ],
  migrations: [path.join(__dirname, 'migrations/*.{ts,js}')],
  synchronize: config.database.synchronize,
  migrationsRun: config.database.migrationsRun,
  logging: config.database.logging,
});

export async function initializeDatabase() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}
