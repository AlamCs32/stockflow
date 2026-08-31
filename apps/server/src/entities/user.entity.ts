import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RefreshToken } from './auth/refresh-token.entity';
import { UserRole } from './auth/user-role.entity';
import { Item } from './item.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text', name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'text', name: 'full_name' })
  fullName: string;

  @Column({ type: 'text', nullable: true })
  phone?: string | null;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ type: 'timestamptz', name: 'last_login_at', nullable: true })
  lastLoginAt?: Date | null;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken[];

  @OneToMany(() => UserRole, (ur) => ur.user)
  userRoles: UserRole[];

  @OneToMany(() => Item, (item) => item.user)
  items: Item[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
