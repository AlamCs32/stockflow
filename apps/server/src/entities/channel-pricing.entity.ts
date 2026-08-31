import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';

export enum SalesChannel {
  MEESHO = 'MEESHO',
  FLIPKART = 'FLIPKART',
  AMAZON = 'AMAZON',
}

@Entity('channel_pricings')
export class ChannelPricing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', name: 'channel_name', enum: SalesChannel })
  channelName: SalesChannel;

  @Column({ type: 'real', name: 'selling_price' })
  sellingPrice: number;

  @Column({ type: 'real' })
  margin: number;

  @ManyToOne(() => ProductVariant, (variant) => variant.pricings)
  @JoinColumn({ name: 'variant_id' })
  variant?: ProductVariant;

  @Column({ type: 'integer', name: 'variant_id' })
  variantId: number;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
