/* */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm'

/* */
import { FeedbackField, FeedbackResponse } from './index'

@Entity('feedbackResponseFields')
export class FeedbackResponseField {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('uuid')
  feedbackFieldId!: string

  @Column('number')
  feedbackResponseId!: number

  @Column({ type: 'nvarchar', length: 10000 })
  value!: any

  @Column('timestampz')
  @CreateDateColumn()
  createdTime!: Date

  @Column('timestamptz')
  @UpdateDateColumn()
  updatedTime!: Date

  @ManyToOne((type) => FeedbackField)
  @JoinColumn({ name: 'feedbackFieldId' })
  feedbackField: FeedbackField

  @ManyToOne((type) => FeedbackResponse, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'feedbackResponseId' })
  feedbackResponse: FeedbackResponse
}
