/* */
import {
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'

/* */
import { RoleUserBinding, UserProfile } from './index'
import { UserState } from '@/types'
import { IUser } from '@/types'

@Entity('users')
export default class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ unique: true, nullable: true, type: 'varchar' })
  email!: string | null

  @Column('enum', { enum: UserState, default: UserState.Active })
  state: UserState

  @Column({ select: false, nullable: true })
  hashPassword: string

  @Column('boolean', { default: false })
  isVerified: boolean

  @OneToOne((type) => UserProfile, (profile) => profile.user)
  profile!: UserProfile

  @Column('timestampz')
  @CreateDateColumn()
  createdTime!: Date

  @Column('timestamptz')
  @UpdateDateColumn()
  updatedTime!: Date

  @OneToMany(
    (type) => RoleUserBinding,
    (roleUserBinding) => roleUserBinding.user
  )
  roleUserBindings: Array<RoleUserBinding>
}
