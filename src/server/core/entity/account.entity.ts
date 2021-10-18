/* */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn
} from 'typeorm'

/* */
import { User } from './index'

@Entity('accounts')
export default class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 255 })
  provider!: string

  @Column({ length: 255 })
  providerKey!: string

  @Column('uuid')
  userId!: string

  @Column('timestampz')
  @CreateDateColumn()
  createdTime!: Date

  @Column('timestamptz')
  @UpdateDateColumn()
  updatedTime!: Date

  @OneToOne((type) => User, { cascade: true })
  @JoinColumn({ name: 'userId' })
  user!: User
}
