/* */
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  JoinColumn
} from 'typeorm'

/* */
import { Permission } from '@/types'
import { Role } from '#/core/entity/index'

@Entity('rolePermissionBindings')
export default class RolePermissionBinding {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('uuid')
  roleId!: string

  @Column('enum', { enum: Permission })
  permission: Permission

  @Column('timestampz')
  @CreateDateColumn()
  createdTime!: Date

  @Column('timestamptz')
  @UpdateDateColumn()
  updatedTime!: Date

  // @OneToOne((type) => Role)
  // @JoinColumn({ name: 'roleId' })
  // role!: Role
}
