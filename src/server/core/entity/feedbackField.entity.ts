/* */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
  JoinColumn,
  OneToMany
} from 'typeorm'

/* */
import { FormFieldType } from '@/types'
import { Feedback } from './index'

@Entity('feedbackFields')
@Index(['feedbackId'])
export default class FeedbackField {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 255, nullable: false })
  name!: string

  @Column({ length: 255, default: '' })
  description!: string

  @Column('enum', { enum: FormFieldType, nullable: false })
  type!: FormFieldType

  @Column('boolean', { default: false })
  isRequired!: boolean

  @Column()
  order!: number

  @Column('uuid')
  feedbackId!: string

  @Column('simple-array')
  option!: Array<string>

  @Column('timestampz')
  @CreateDateColumn()
  createdTime!: Date

  @Column('timestamptz')
  @UpdateDateColumn()
  updatedTime!: Date

  @ManyToOne((type) => Feedback, (feedback) => feedback.fields)
  @JoinColumn({ name: 'feedbackId' })
  feedback!: Feedback
}
