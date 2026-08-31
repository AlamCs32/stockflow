import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Supplier } from './supplier.entity';
import { Category } from './category.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('designs')
export class Design {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', name: 'design_code', unique: true })
  designCode: string;

  @Column({ type: 'text', name: 'pattern_code' })
  patternCode: string;

  @Column({ type: 'text' })
  name: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.designs)
  @JoinColumn({ name: 'supplier_id' })
  supplier?: Supplier;

  @Column({ type: 'uuid', name: 'supplier_id' })
  supplierId: string;

  @ManyToOne(() => Category, (category) => category.designs)
  @JoinColumn({ name: 'category_id' })
  category?: Category;

  @Column({ type: 'integer', name: 'category_id' })
  categoryId: number;

  @OneToMany(() => ProductVariant, (variant) => variant.design)
  variants: ProductVariant[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
