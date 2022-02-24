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
import { ApiProperty } from '@nestjs/swagger'

/* */
import { RoleUserBinding, UserProfile } from './index'
import { UserState } from '@/types'
import { IUser } from '@/types'

@Entity('users')
export class User implements IUser {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ApiProperty()
  @Column({ unique: true, nullable: true, type: 'varchar' })
  email!: string | null

  @Column('enum', { enum: UserState, default: UserState.Active })
  state: UserState

  @Column({ select: false, nullable: true })
  hashPassword: string

  @Column('boolean', { default: false })
  isVerified: boolean

  @ApiProperty({ type: () => UserProfile })
  @OneToOne((type) => UserProfile, (profile) => profile.user)
  profile!: UserProfile

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
    (roleUserBindings) => roleUserBindings.user
  )
  roleUserBindings: Array<RoleUserBinding>
}
