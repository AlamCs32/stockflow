import 'reflect-metadata';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DataSource } from 'typeorm';
import { config } from '@stockflow/config';
import { Item } from '../entities/item.entity';
import { User } from '../entities/user.entity';
import { Category } from '../entities/category.entity';
import { Vendor } from '../entities/vendor.entity';
import { Design } from '../entities/design.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { ChannelPricing } from '../entities/channel-pricing.entity';
import { StockLog } from '../entities/stock-log.entity';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const AppDataSource = new DataSource({
  type: config.database.type,
  database: path.resolve(config.database.path),
  entities: [Item, User, Category, Vendor, Design, ProductVariant, ChannelPricing, StockLog],
  migrations: [path.join(__dirname, 'migrations/*.{ts,js}')],
  synchronize: config.database.synchronize,
  migrationsRun: config.database.migrationsRun,
  logging: config.database.logging,
});

export async function initializeDatabase() {
  const dbPath = path.resolve(config.database.path);
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}
