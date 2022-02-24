/* */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

/* */
import { User, FeedbackField, FeedbackResponse } from './index'
import { IFeedback } from '@/types'

@Entity('feedbacks')
export class Feedback implements IFeedback {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ApiProperty()
  @Column({ length: 255 })
  title!: string

  @ApiProperty()
  @Column({ length: 255, default: '' })
  description: string

  @ApiProperty()
  @Column('boolean', { default: false })
  allowAnonymous!: boolean

  @ApiProperty()
  @Column({ length: 255 })
  code!: string

  @ApiProperty()
  @Column('uuid')
  userId!: string

  @ApiProperty()
  @Column('timestampz')
  @CreateDateColumn()
  createdTime!: Date

  @ApiProperty()
  @Column('timestamptz')
  @UpdateDateColumn()
  updatedTime!: Date

  @ManyToOne((type) => User, { cascade: true, eager: true })
  @JoinColumn({ name: 'userId' })
  user!: User

  @ApiProperty({ type: () => [FeedbackField] })
  @OneToMany((type) => FeedbackField, (fields) => fields.feedback)
  fields: Array<FeedbackField>

  @OneToMany((type) => FeedbackResponse, (response) => response.feedback)
  responses: Array<FeedbackResponse>
}
