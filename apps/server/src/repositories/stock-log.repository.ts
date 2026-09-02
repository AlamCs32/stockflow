import { AppDataSource } from '@/database/data-source';
import { StockLog, StockLogReason } from '@/entities/stock-log.entity';

export const stockLogRepository = AppDataSource.getRepository(StockLog);

export async function createStockLog(data: {
  variantId: number;
  quantityChange: number;
  reason: StockLogReason;
  channel?: string | null;
}): Promise<StockLog> {
  const log = stockLogRepository.create(data);
  return stockLogRepository.save(log);
}
