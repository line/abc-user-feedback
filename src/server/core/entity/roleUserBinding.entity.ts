/* */
import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn
} from 'typeorm'

/* */
import { User, Role } from '#/core/entity/index'

@Entity('roleUserBindings')
export class RoleUserBinding {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('uuid')
  userId!: string

  @Column('uuid')
  roleId!: string

  @Column('timestampz')
  @CreateDateColumn()
  createdTime!: Date

  @Column('timestamptz')
  @UpdateDateColumn()
  updatedTime!: Date

  @ManyToOne((type) => User, (user) => user.roleUserBindings)
  @JoinColumn({ name: 'userId' })
  user!: User

  @ManyToOne((type) => Role, (role) => role.roleUserBindings)
  @JoinColumn({ name: 'roleId' })
  role!: Role
}
