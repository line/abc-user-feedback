import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

/* */
import { User } from './user.entity'

@Entity('userProfiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ApiProperty()
  @Column({ nullable: true })
  nickname!: string

  @ApiProperty()
  @Column({ nullable: true })
  avatarUrl: string

  @ApiProperty()
  @Column('uuid')
  userId!: string

  @ApiProperty()
  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date

  @ApiProperty()
  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date

  @OneToOne((type) => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User

  toJSON() {
    delete this.id
    return this
  }
}
