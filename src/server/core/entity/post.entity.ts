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
import { User, Comment } from './index'

@Entity('posts')
export default class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  number!: number

  @Column({ length: 255 })
  title!: string

  @Column('text')
  body!: string

  @Column('uuid')
  userId!: string

  @Column({ default: 0 })
  voteCount!: number

  @Column({ default: 0 })
  commentCount!: number

  @Column('boolean', { default: false })
  isPrivate!: boolean

  @Column('timestampz')
  @CreateDateColumn()
  createdTime!: Date

  @Column('timestamptz')
  @UpdateDateColumn()
  updatedTime!: Date

  @ManyToOne((type) => User, { cascade: true, eager: true })
  @JoinColumn({ name: 'userId' })
  user!: User

  @OneToMany((type) => Comment, (comment) => comment.post)
  comments!: Array<Comment>
}
