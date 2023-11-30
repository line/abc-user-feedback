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

import { IssueEntity } from '@/domains/project/issue/issue.entity';

@Entity('feedback_issue_statistics')
@Unique('issue-date-unique', ['issue', 'date'])
export class FeedbackIssueStatisticsEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('date')
  date: Date;

  @Column('int', { default: 0 })
  feedbackCount: number;

  @ManyToOne(() => IssueEntity, (issue) => issue.stats, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  issue: Relation<IssueEntity>;

  static from({
    date,
    feedbackCount,
    issueId,
  }: {
    date: Date;
    feedbackCount: number;
    issueId: number;
  }) {
    const feedbackIssueStats = new FeedbackIssueStatisticsEntity();
    feedbackIssueStats.issue = new IssueEntity();
    feedbackIssueStats.issue.id = issueId;
    feedbackIssueStats.date = date;
    feedbackIssueStats.feedbackCount = feedbackCount;

    return feedbackIssueStats;
  }
}
