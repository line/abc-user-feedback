/**
 * Copyright 2023 LINE Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
import { Column, Entity, JoinColumn, OneToOne, Relation } from 'typeorm';

import { CommonEntity } from '@/common/entities';

import { RoleEntity } from '../role/role.entity';

@Entity('tenant')
export class TenantEntity extends CommonEntity {
  @Column('varchar', { length: 50 })
  siteName: string;

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
