/* */
import {
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

/* */
import { UserProfile } from './index'
import { UserState, UserRole } from '@/types'
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

  @Column('enum', { enum: UserRole, default: UserRole.User })
  role: UserRole

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
}
