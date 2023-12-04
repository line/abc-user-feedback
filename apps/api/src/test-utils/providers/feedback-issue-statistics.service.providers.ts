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
import { SchedulerRegistry } from '@nestjs/schedule';
import { getRepositoryToken } from '@nestjs/typeorm';

import { FeedbackEntity } from '@/domains/feedback/feedback.entity';
import { IssueEntity } from '@/domains/project/issue/issue.entity';
import { ProjectEntity } from '@/domains/project/project/project.entity';
import { FeedbackIssueStatisticsEntity } from '@/domains/statistics/feedback-issue/feedback-issue-statistics.entity';
import { FeedbackIssueStatisticsService } from '@/domains/statistics/feedback-issue/feedback-issue-statistics.service';
import { mockRepository } from '@/test-utils/util-functions';

export const FeedbackIssueStatisticsServiceProviders = [
  FeedbackIssueStatisticsService,
  {
    provide: getRepositoryToken(FeedbackIssueStatisticsEntity),
    useValue: mockRepository(),
  },
  {
    provide: getRepositoryToken(FeedbackEntity),
    useValue: mockRepository(),
  },
  {
    provide: getRepositoryToken(IssueEntity),
    useValue: mockRepository(),
  },
  {
    provide: getRepositoryToken(ProjectEntity),
    useValue: mockRepository(),
  },
  SchedulerRegistry,
];
