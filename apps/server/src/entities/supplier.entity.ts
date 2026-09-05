import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Design } from './design.entity';

export enum SupplierCategory {
  GARMENT = 'GARMENT',
  BAGS = 'BAGS',
  ELECTRONICS = 'ELECTRONICS',
  FURNITURE = 'FURNITURE',
  FOOTWEAR = 'FOOTWEAR',
  ACCESSORIES = 'ACCESSORIES',
  GROCERY = 'GROCERY',
  GENERAL = 'GENERAL',
}

export enum AvailabilityStatus {
  ALWAYS_AVAILABLE = 'ALWAYS_AVAILABLE',
  SEASONAL = 'SEASONAL',
  ON_ORDER = 'ON_ORDER',
  CHECK_STOCK = 'CHECK_STOCK',
}

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  code: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', name: 'contact_email' })
  contactEmail: string;

  @Column({ type: 'text', name: 'mobile_no' })
  mobileNo: string;

  @Column({
    type: 'text',
    name: 'category',
    default: SupplierCategory.GENERAL,
  })
  category: SupplierCategory;

  @Column({ type: 'integer', name: 'trust_score', default: 0 })
  trustScore: number;

  @Column({ type: 'integer', name: 'quality_score', default: 0 })
  qualityScore: number;

  @Column({
    type: 'text',
    name: 'availability_status',
    default: AvailabilityStatus.ALWAYS_AVAILABLE,
  })
  availabilityStatus: AvailabilityStatus;

  @Column({ type: 'integer', name: 'lead_time_days', nullable: true })
  leadTimeDays: number | null;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'text', nullable: true })
  city: string | null;

  @Column({ type: 'text', nullable: true })
  state: string | null;

  @Column({ type: 'text', name: 'gst_number', nullable: true })
  gstNumber: string | null;

  @Column({ type: 'text', name: 'pan_number', nullable: true })
  panNumber: string | null;

  @OneToMany(() => Design, (design) => design.supplier)
  designs: Design[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
