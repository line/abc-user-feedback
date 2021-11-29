/* */
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn
} from 'typeorm'

/* */
import { User, Role } from '#/core/entity/index'

@Entity('roleUserBindings')
export default class RoleUserBinding {
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

  @OneToOne((type) => User, { cascade: true })
  @JoinColumn({ name: 'userId' })
  user!: User

  @OneToOne((type) => Role, { cascade: true })
  @JoinColumn({ name: 'roleId' })
  role!: Role
}
