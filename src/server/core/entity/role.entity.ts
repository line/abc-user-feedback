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
import { ApiProperty } from '@nestjs/swagger'

@Entity('roles')
export default class Role {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ApiProperty()
  @Column('varchar', {
    length: 20,
    unique: true
  })
  name!: string

  @ApiProperty()
  @Column({ nullable: true, default: '' })
  description!: string

  @ApiProperty()
  @Column('timestampz')
  @CreateDateColumn()
  createdTime!: Date

  @ApiProperty()
  @Column('timestamptz')
  @UpdateDateColumn()
  updatedTime!: Date

  @OneToMany(
    (type) => RoleUserBinding,
    (roleUserBindings) => roleUserBindings.role
  )
  roleUserBindings: Array<RoleUserBinding>
}
