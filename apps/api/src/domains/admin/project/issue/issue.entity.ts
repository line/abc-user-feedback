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
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Relation,
  Unique,
} from 'typeorm';

import { CommonEntity } from '@/common/entities';
import { IssueStatusEnum } from '@/common/enums';
import { FeedbackIssueStatisticsEntity } from '@/domains/admin/statistics/feedback-issue/feedback-issue-statistics.entity';
import { FeedbackEntity } from '../../feedback/feedback.entity';
import { CategoryEntity } from '../category/category.entity';
import { ProjectEntity } from '../project/project.entity';

@Entity('issues')
@Index(['project.id', 'createdAt'])
@Unique('issue-name-unique', ['name', 'project'])
export class IssueEntity extends CommonEntity {
  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { nullable: true })
  description?: string | null;

  @Column('enum', { enum: IssueStatusEnum, default: IssueStatusEnum.INIT })
  @Index()
  status: IssueStatusEnum;

  @Column('varchar', { nullable: true })
  externalIssueId: string;

  @Column('int', { default: 0 })
  @Index()
  feedbackCount: number;

  @ManyToMany(() => FeedbackEntity, (feedback) => feedback.issues, {
    onDelete: 'CASCADE',
  })
  feedbacks: FeedbackEntity[];

  @ManyToOne(() => ProjectEntity, (project) => project.issues, {
    onDelete: 'CASCADE',
  })
  project: Relation<ProjectEntity>;

  @OneToMany(() => FeedbackIssueStatisticsEntity, (stats) => stats.issue, {
    cascade: true,
  })
  stats: Relation<FeedbackIssueStatisticsEntity>[];

  @ManyToOne(() => CategoryEntity, (category) => category.issues, {
    onDelete: 'CASCADE',
  })
  category: Relation<CategoryEntity> | null;

  static from({
    name,
    status,
    description,
    externalIssueId,
    projectId,
    categoryId,
  }: {
    name: string;
    status: IssueStatusEnum;
    description?: string | null;
    externalIssueId: string;
    projectId: number;
    categoryId?: number;
  }) {
    const issue = new IssueEntity();
    issue.name = name;
    issue.status = status;
    issue.description = description;
    issue.externalIssueId = externalIssueId;
    issue.project = new ProjectEntity();
    issue.project.id = projectId;
    if (categoryId) {
      issue.category = new CategoryEntity();
      issue.category.id = categoryId;
    }

    return issue;
  }
}
