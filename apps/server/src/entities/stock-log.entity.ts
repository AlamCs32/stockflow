import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductVariant } from './product-variant.entity';

export enum StockLogReason {
  INWARD = 'INWARD',
  SALE = 'SALE',
  RETURN = 'RETURN',
  ADJUSTMENT = 'ADJUSTMENT',
}

@Entity('stock_logs')
export class StockLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductVariant, (variant) => variant.stockLogs)
  @JoinColumn({ name: 'variant_id' })
  variant?: ProductVariant;

  @Column({ type: 'integer', name: 'variant_id' })
  variantId: number;

  @Column({ type: 'integer', name: 'quantity_change' })
  quantityChange: number;

  @Column({ type: 'text', enum: StockLogReason })
  reason: StockLogReason;

  @Column({ type: 'text', nullable: true })
  channel?: string | null;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}
