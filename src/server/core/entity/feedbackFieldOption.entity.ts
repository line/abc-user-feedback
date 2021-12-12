/* */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'

/* */
import { FeedbackField } from './index'

@Entity('feedbackFieldOptions')
export default class FeedbackFieldOption {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 255, nullable: false })
  label!: string

  @Column({ length: 255, nullable: false })
  value!: string

  @Column('uuid')
  feedbackFieldId!: string

  @Column('timestampz')
  @CreateDateColumn()
  createdTime!: Date

  @Column('timestamptz')
  @UpdateDateColumn()
  updatedTime!: Date

  @ManyToOne((type) => FeedbackField, (feedbackField) => feedbackField.options)
  @JoinColumn({ name: 'feedbackFieldId' })
  feedbackField!: FeedbackField
}
