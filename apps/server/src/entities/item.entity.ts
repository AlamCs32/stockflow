import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @ManyToOne(() => User, (user) => user.items, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ type: 'integer', name: 'user_id', nullable: true })
  userId?: number;

  @ManyToOne(() => Category, (category) => category.items, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category?: Category;

  @Column({ type: 'integer', name: 'category_id', nullable: true })
  categoryId?: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}
