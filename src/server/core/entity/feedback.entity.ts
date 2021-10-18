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

/* */
import { User, FeedbackField, FeedbackResponse } from './index'

@Entity('feedbacks')
export default class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ length: 255 })
  title!: string

  @Column({ length: 255, default: '' })
  description: string

  @Column('boolean', { default: false })
  allowAnonymous!: boolean

  @Column({ length: 255 })
  code!: string

  @Column('uuid')
  userId!: string

  @Column('timestampz')
  @CreateDateColumn()
  createdTime!: Date

  @Column('timestamptz')
  @UpdateDateColumn()
  updatedTime!: Date

  @ManyToOne((type) => User, { cascade: true, eager: true })
  @JoinColumn({ name: 'userId' })
  user!: User

  @OneToMany((type) => FeedbackField, (fields) => fields.feedback)
  fields: Array<FeedbackField>

  @OneToMany((type) => FeedbackResponse, (response) => response.feedback)
  responses: Array<FeedbackResponse>
}
