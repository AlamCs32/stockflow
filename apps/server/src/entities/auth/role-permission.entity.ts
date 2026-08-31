import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';
import { Module } from './module.entity';

@Entity('role_permissions')
export class RolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Role, (role) => role.permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role?: Role;

  @Column({ type: 'uuid', name: 'role_id' })
  roleId: string;

  @ManyToOne(() => Module, (mod) => mod.permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'module_id' })
  module?: Module;

  @Column({ type: 'uuid', name: 'module_id' })
  moduleId: string;

  @Column({ type: 'boolean', name: 'can_read', default: false })
  canRead: boolean;

  @Column({ type: 'boolean', name: 'can_write', default: false })
  canWrite: boolean;

  @Column({ type: 'boolean', name: 'can_update', default: false })
  canUpdate: boolean;

  @Column({ type: 'boolean', name: 'can_delete', default: false })
  canDelete: boolean;
}
