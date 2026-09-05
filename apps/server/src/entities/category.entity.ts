import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Design } from './design.entity';

export interface CategoryFieldDef {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  required?: boolean;
  options?: string[];
  placeholder?: string;
}

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  name: string;

  @Column({ type: 'text', unique: true })
  code: string;

  @Column({ type: 'jsonb', name: 'attributes_schema', default: [] })
  attributesSchema: CategoryFieldDef[];

  @OneToMany(() => Design, (design) => design.category)
  designs: Design[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
