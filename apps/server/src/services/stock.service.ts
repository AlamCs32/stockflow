import { AppDataSource } from '@/database/data-source';
import { ProductVariant } from '@/entities/product-variant.entity';
import { StockLog, StockLogReason } from '@/entities/stock-log.entity';
import { BusinessRuleError, NotFoundError } from '@/shared/errors';

export interface StockAdjustment {
  variantId: number;
  quantityChange: number;
  reason: StockLogReason;
  channel?: string | null;
}

const POSITIVE_REASONS: readonly StockLogReason[] = [StockLogReason.INWARD, StockLogReason.RETURN];
const NEGATIVE_REASONS: readonly StockLogReason[] = [StockLogReason.SALE];

function assertReasonSign(reason: StockLogReason, quantityChange: number): void {
  if (POSITIVE_REASONS.includes(reason) && quantityChange <= 0) {
    throw new BusinessRuleError(`Reason ${reason} requires a positive quantity change`);
  }
  if (NEGATIVE_REASONS.includes(reason) && quantityChange >= 0) {
    throw new BusinessRuleError(`Reason ${reason} requires a negative quantity change`);
  }
}

export async function adjustStock({
  variantId,
  quantityChange,
  reason,
  channel = null,
}: StockAdjustment): Promise<{ variant: ProductVariant; log: StockLog }> {
  assertReasonSign(reason, quantityChange);

  return AppDataSource.transaction(async (manager) => {
    const variant = await manager.findOne(ProductVariant, { where: { id: variantId } });
    if (!variant) {
      throw new NotFoundError('Product variant');
    }

    const nextQuantity = variant.stockQuantity + quantityChange;
    if (nextQuantity < 0) {
      throw new BusinessRuleError(
        `Insufficient stock: current ${variant.stockQuantity}, requested change ${quantityChange}`
      );
    }

    variant.stockQuantity = nextQuantity;
    await manager.save(ProductVariant, variant);

    const log = manager.create(StockLog, {
      variantId: variant.id,
      quantityChange,
      reason,
      channel,
    });
    await manager.save(StockLog, log);

    return { variant, log };
  });
}
