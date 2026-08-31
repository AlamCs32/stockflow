import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Design } from './design.entity';
import { ChannelPricing } from './channel-pricing.entity';
import { StockLog } from './stock-log.entity';

export enum VariantStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  sku: string;

  @Column({ type: 'text', name: 'color_name' })
  colorName: string;

  @Column({ type: 'text', name: 'color_code' })
  colorCode: string;

  @Column({ type: 'text' })
  size: string;

  @Column({ type: 'double precision', name: 'cost_price' })
  costPrice: number;

  @Column({ type: 'integer', name: 'stock_quantity', default: 0 })
  stockQuantity: number;

  @Column({ type: 'text', name: 'sample_photo_url', nullable: true })
  samplePhotoUrl?: string | null;

  @Column({ type: 'text', enum: VariantStatus, default: VariantStatus.ACTIVE })
  status: VariantStatus;

  @ManyToOne(() => Design, (design) => design.variants)
  @JoinColumn({ name: 'design_id' })
  design?: Design;

  @Column({ type: 'integer', name: 'design_id' })
  designId: number;

  @OneToMany(() => ChannelPricing, (pricing) => pricing.variant)
  pricings: ChannelPricing[];

  @OneToMany(() => StockLog, (log) => log.variant)
  stockLogs: StockLog[];
}
