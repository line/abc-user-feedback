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
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';

import type { TimezoneOffset } from '@ufb/shared';

import { CommonEntity } from '@/common/entities';
import type { ApiKeyEntity } from '@/domains/admin/project/api-key/api-key.entity';
import type { IssueTrackerEntity } from '@/domains/admin/project/issue-tracker/issue-tracker.entity';
import { IssueStatisticsEntity } from '@/domains/admin/statistics/issue/issue-statistics.entity';
import { TenantEntity } from '@/domains/admin/tenant/tenant.entity';
import { ChannelEntity } from '../../channel/channel/channel.entity';
import { IssueEntity } from '../issue/issue.entity';
import { RoleEntity } from '../role/role.entity';

export interface Timezone {
  countryCode: string;
  name: string;
  offset: TimezoneOffset;
}

@Entity('projects')
export class ProjectEntity extends CommonEntity {
  @Column('varchar', { unique: true })
  name: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column({
    type: 'varchar',
    default: JSON.stringify({
      countryCode: 'KR',
      name: 'Asia/Seoul',
      offset: '+09:00',
    }),
    transformer: {
      from: (value: string) =>
        typeof value === 'object' ? value : JSON.parse(value),
      to: (value: Timezone) => JSON.stringify(value),
    },
  })
  timezone: Timezone;

  @OneToMany(() => ChannelEntity, (channel) => channel.project, {
    cascade: true,
  })
  channels: Relation<ChannelEntity>[];

  @OneToMany(() => IssueEntity, (issue) => issue.project, {
    cascade: true,
  })
  issues: Relation<IssueEntity>[];

  @OneToMany(() => IssueEntity, (apiKey) => apiKey.project, {
    cascade: true,
  })
  apiKeys: Relation<ApiKeyEntity>[];

  @OneToOne(() => IssueEntity, (issueTracker) => issueTracker.project, {
    cascade: true,
  })
  issueTracker: Relation<IssueTrackerEntity>;

  @OneToMany(() => RoleEntity, (role) => role.project, {
    cascade: true,
  })
  roles: Relation<RoleEntity>[];

  @ManyToOne(() => TenantEntity, (tenant) => tenant.projects, {
    onDelete: 'CASCADE',
  })
  tenant: Relation<TenantEntity>;

  @OneToMany(() => IssueStatisticsEntity, (stats) => stats.project, {
    cascade: true,
  })
  stats: Relation<IssueStatisticsEntity>[];

  static from({
    tenantId,
    name,
    description,
    timezone,
  }: {
    tenantId: number;
    name: string;
    description: string;
    timezone: Timezone;
  }) {
    const project = new ProjectEntity();
    project.tenant = new TenantEntity();
    project.tenant.id = tenantId;
    project.name = name;
    project.description = description;
    project.timezone = timezone;

    return project;
  }
}
