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
import { ApiProperty } from '@nestjs/swagger'

/* */
import { FormFieldType, IFeedbackField } from '@/types'
import { Feedback, FeedbackFieldOption } from './index'

@Entity('feedbackFields')
@Index(['feedbackId'])
export class FeedbackField implements IFeedbackField {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ApiProperty()
  @Column({ length: 255, nullable: false })
  name!: string

  @ApiProperty()
  @Column({ length: 255, default: '' })
  description!: string

  @ApiProperty({ enum: FormFieldType })
  @Column('enum', { enum: FormFieldType, nullable: false })
  type!: FormFieldType

  @ApiProperty()
  @Column('boolean', { default: false })
  isRequired!: boolean

  @ApiProperty()
  @Column()
  order!: number

  @ApiProperty()
  @Column('uuid')
  feedbackId!: string

  @Column('timestampz')
  @CreateDateColumn()
  createdTime!: Date

  @Column('timestamptz')
  @UpdateDateColumn()
  updatedTime!: Date

  @ManyToOne((type) => Feedback, (feedback) => feedback.fields)
  @JoinColumn({ name: 'feedbackId' })
  feedback!: Feedback

  @ApiProperty({ type: () => [FeedbackFieldOption] })
  @OneToMany((type) => FeedbackFieldOption, (options) => options.feedbackField)
  options: Array<FeedbackFieldOption>
}
