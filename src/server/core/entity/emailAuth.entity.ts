/* */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

/* */
import { EmailAuthType } from '@/types'

@Entity('email_auths')
export class EmailAuth {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 255 })
  code!: string

  @Column({ length: 255 })
  email!: string

  @Column('uuid', { nullable: true })
  userId: string

  @Column('enum', { enum: EmailAuthType, default: EmailAuthType.Register })
  type!: EmailAuthType

  @Column({ nullable: true })
  asRole!: string

  @Column({ default: false })
  isVerified!: boolean

  @Column('timestampz')
  @CreateDateColumn()
  createdTime!: Date

  @Column('timestamptz')
  @UpdateDateColumn()
  updatedTime!: Date
}
