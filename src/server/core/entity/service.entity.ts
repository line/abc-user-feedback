/* */
import {
  Entity,
  Column,
  Check,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity('service')
export default class Service {
  @PrimaryGeneratedColumn('increment')
  version!: number

  @Column()
  name!: string

  @Column()
  description!: string

  @Column()
  logoUrl: string

  @Column({ default: false })
  isPrivate: boolean

  @Column({ default: false })
  isRestrictDomain: boolean

  @Column('simple-array')
  allowDomains: Array<string>

  @Column('timestampz')
  @CreateDateColumn()
  createdTime!: Date

  @Column('timestamptz')
  @UpdateDateColumn()
  updatedTime!: Date
}
