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
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from 'typeorm';

import { ProjectEntity } from '@/domains/admin/project/project/project.entity';

@Entity('issue_statistics')
@Unique('project-date-unique', ['project', 'date'])
export class IssueStatisticsEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('date')
  date: Date;

  @Column('int', { default: 0 })
  count: number;

  @ManyToOne(() => ProjectEntity, (project) => project.stats, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  project: Relation<ProjectEntity>;

  static from({
    date,
    count,
    projectId,
  }: {
    date: Date;
    count: number;
    projectId: number;
  }) {
    const issueStats = new IssueStatisticsEntity();
    issueStats.project = new ProjectEntity();
    issueStats.project.id = projectId;
    issueStats.date = date;
    issueStats.count = count;

    return issueStats;
  }
}
