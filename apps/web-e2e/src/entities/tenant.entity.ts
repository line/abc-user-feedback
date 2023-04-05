import { Column, Entity, JoinColumn, OneToOne, Relation } from 'typeorm';

import { CommonEntity } from './common.entity';
import { RoleEntity } from './role.entity';

@Entity('tenant')
export class TenantEntity extends CommonEntity {
  @Column('varchar', { length: 50 })
  siteName: string;

  @Column('varchar')
  siteLogoUrl: string;

  @Column('boolean')
  isPrivate: boolean;

  @Column('boolean')
  isRestrictDomain: boolean;

  @Column('simple-array')
  allowDomains: Array<string>;

  @OneToOne(() => RoleEntity)
  @JoinColumn()
  defaultRole: Relation<RoleEntity>;
}
