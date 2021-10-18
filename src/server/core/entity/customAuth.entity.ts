/* */
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'

/* */
import { User } from './index'

@Entity('custom_auths')
export default class CustomAuth {
  @PrimaryColumn()
  id!: string

  @Column('uuid')
  userId!: string

  @Column('timestampz')
  @CreateDateColumn()
  createdTime!: Date

  @Column('timestamptz')
  @UpdateDateColumn()
  updatedTime!: Date

  @ManyToOne((type) => User, { cascade: true })
  @JoinColumn({ name: 'userId' })
  user!: User
}
