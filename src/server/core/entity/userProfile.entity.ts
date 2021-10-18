import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn
} from 'typeorm'

/* */
import { User } from './index'

@Entity('userProfiles')
export default class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ unique: true, nullable: true })
  nickname!: string

  @Column({ nullable: true })
  avatarUrl: string

  @Column('uuid')
  userId!: string

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date

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
