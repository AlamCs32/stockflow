import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Design } from './design.entity';

@Entity('vendors')
export class Vendor {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', name: 'contact_email' })
  contactEmail: string;

  @OneToMany(() => Design, (design) => design.vendor)
  designs: Design[];

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}
