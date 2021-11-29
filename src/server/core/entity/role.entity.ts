/* */
import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm'

/* */
import { RoleUserBinding, RolePermissionBinding } from '#/core/entity'

@Entity('roles')
export default class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('varchar', {
    length: 20,
    unique: true
  })
  name!: string

  @Column({ nullable: true, default: '' })
  description!: string

  @Column('timestampz')
  @CreateDateColumn()
  createdTime!: Date

  @Column('timestamptz')
  @UpdateDateColumn()
  updatedTime!: Date

  // @OneToMany(
  //   (type) => RolePermissionBinding,
  //   (rolePermissionBinding) => rolePermissionBinding.role
  // )
  // rolePermissionBindings: Array<RolePermissionBinding>

  @OneToMany(
    (type) => RoleUserBinding,
    (roleUserBinding) => roleUserBinding.role
  )
  roleUserBinding: Array<RoleUserBinding>
}
