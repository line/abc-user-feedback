/* */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

/* */
import { User, Post } from './index'

@Entity('comments')
export default class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('text')
  body!: string

  @Column('uuid')
  userId!: string

  @Column('uuid')
  postId!: string

  @Column({ default: 0 })
  voteCount!: number

  @Column('timestampz')
  @CreateDateColumn()
  createdTime!: Date

  @Column('timestamptz')
  @UpdateDateColumn()
  updatedTime!: Date

  @ManyToOne((type) => User, { cascade: true, eager: true })
  @JoinColumn({ name: 'userId' })
  user!: User

  @ManyToOne((type) => Post, (post) => post.comments)
  @JoinColumn({ name: 'postId' })
  post!: Post
}
