/* */
import {
  Entity,
  Column,
  Check,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm'

/* */
import { Locale } from '@/types'

@Entity('service')
export class Service {
  @PrimaryGeneratedColumn('increment')
  version!: number

  @Column()
  name!: string

  @Column()
  description!: string

  @Column()
  entryPath: string

  @Column()
  logoUrl: string

  @Column('enum', { enum: Locale, nullable: false })
  locale: Locale

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
