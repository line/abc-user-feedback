/* */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

/* */
import { User, Post } from './index'

@Entity('postVotes')
export class PostVote {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('uuid')
  postId!: string

  @Column('uuid')
  userId!: string

  @Column('timestampz')
  @CreateDateColumn()
  createdTime!: Date

  @Column('timestamptz')
  @UpdateDateColumn()
  updatedTime!: Date

  @ManyToOne((type) => Post, { cascade: true, eager: true })
  @JoinColumn({ name: 'postId' })
  post!: Post

  @ManyToOne((type) => User, { cascade: true, eager: true })
  @JoinColumn({ name: 'userId' })
  user!: User
}
