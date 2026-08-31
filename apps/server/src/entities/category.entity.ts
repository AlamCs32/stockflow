import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item.entity';
import { Design } from './design.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  name: string;

  @Column({ type: 'text', unique: true })
  code: string;

  @OneToMany(() => Item, (item) => item.category)
  items: Item[];

  @OneToMany(() => Design, (design) => design.category)
  designs: Design[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
