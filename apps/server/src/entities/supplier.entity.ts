import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Design } from './design.entity';

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

  @OneToMany(() => Design, (design) => design.supplier)
  designs: Design[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
