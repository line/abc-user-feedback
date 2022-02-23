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
import { ApiProperty } from '@nestjs/swagger'

/* */
import { FeedbackField } from './index'
import { IFeedbackFieldOption } from '@/types'

@Entity('feedbackFieldOptions')
export class FeedbackFieldOption implements IFeedbackFieldOption {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ApiProperty()
  @Column({ length: 255, nullable: false })
  label!: string

  @ApiProperty()
  @Column({ length: 255, nullable: false })
  value!: string

  @ApiProperty()
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
