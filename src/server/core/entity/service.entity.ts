/* */
import {
  Entity,
  Column,
  Check,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'

/* */
import { Locale } from '@/types'

@Entity('service')
export class Service {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  version!: number

  @ApiProperty()
  @Column()
  name!: string

  @ApiProperty()
  @Column()
  description!: string

  @ApiProperty()
  @Column()
  entryPath: string

  @ApiProperty()
  @Column()
  logoUrl: string

  @ApiProperty()
  @Column('enum', { enum: Locale, nullable: false })
  locale: Locale

  @ApiProperty()
  @Column({ default: false })
  isPrivate: boolean

  @ApiProperty()
  @Column({ default: false })
  isRestrictDomain: boolean

  @ApiProperty()
  @Column('simple-array')
  allowDomains: Array<string>

  @ApiProperty()
  @Column('timestampz')
  @CreateDateColumn()
  createdTime!: Date

  @ApiProperty()
  @Column('timestamptz')
  @UpdateDateColumn()
  updatedTime!: Date
}
