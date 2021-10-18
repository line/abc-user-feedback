/* */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index
} from 'typeorm'

/* */
import { User, Feedback, FeedbackResponseField } from './index'

@Entity('feedbackResponses')
@Index(['feedbackId'])
export default class FeedbackResponse {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('uuid', { nullable: true })
  userId!: string

  @Column('uuid')
  feedbackId!: string

  @Column('timestampz')
  @CreateDateColumn()
  createdTime!: Date

  @Column('timestamptz')
  @UpdateDateColumn()
  updatedTime!: Date

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'userId' })
  user!: User

  @ManyToOne((type) => Feedback, { cascade: true })
  @JoinColumn({ name: 'feedbackId' })
  feedback!: Feedback

  @OneToMany(
    (type) => FeedbackResponseField,
    (feedbackResponseField) => feedbackResponseField.feedbackResponse,
    { cascade: true }
  )
  feedbackResponseFields: Array<FeedbackResponseField>
}
