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
import type { Relation } from 'typeorm';
import { Column, Entity, OneToMany } from 'typeorm';

import { CommonEntity } from '@/common/entities';
import { ProjectEntity } from '../project/project/project.entity';
import { LoginButtonTypeEnum } from './entities/enums/login-button-type.enum';

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  authCodeRequestURL: string;
  scopeString: string;
  accessTokenRequestURL: string;
  userProfileRequestURL: string;
  emailKey: string;
  defatulLoginEnable?: boolean;
  loginButtonType: LoginButtonTypeEnum | null;
  loginButtonName: string | null;
}

@Entity('tenant')
export class TenantEntity extends CommonEntity {
  @Column('varchar', { length: 50 })
  siteName: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('boolean', { default: true })
  useEmail: boolean;

  @Column('simple-array', { nullable: true })
  allowDomains: string[] | null;

  @Column('boolean', { default: false })
  useOAuth: boolean;

  @Column({ type: 'json', nullable: true })
  oauthConfig: OAuthConfig | null;

  @OneToMany(() => ProjectEntity, (project) => project.tenant, {
    cascade: true,
  })
  projects: Relation<ProjectEntity>[];
}
