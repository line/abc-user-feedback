/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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

import { ChannelEntity } from '@/domains/admin/channel/channel/channel.entity';
import { FeedbackEntity } from '@/domains/admin/feedback/feedback.entity';
import { IssueEntity } from '@/domains/admin/project/issue/issue.entity';
import { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { FeedbackStatisticsEntity } from '@/domains/admin/statistics/feedback/feedback-statistics.entity';
import { FeedbackStatisticsService } from '@/domains/admin/statistics/feedback/feedback-statistics.service';
import { mockRepository } from '@/test-utils/util-functions';
import {
  ChannelRepositoryStub,
  FeedbackRepositoryStub,
  IssueRepositoryStub,
  ProjectRepositoryStub,
} from '../stubs';
import { SchedulerLockServiceProviders } from './scheduler-lock.service.providers';

export const FeedbackStatisticsServiceProviders = [
  FeedbackStatisticsService,
  {
    provide: getRepositoryToken(FeedbackStatisticsEntity),
    useValue: mockRepository(),
  },
  {
    provide: getRepositoryToken(FeedbackEntity),
    useClass: FeedbackRepositoryStub,
  },
  {
    provide: getRepositoryToken(IssueEntity),
    useClass: IssueRepositoryStub,
  },
  {
    provide: getRepositoryToken(ChannelEntity),
    useClass: ChannelRepositoryStub,
  },
  {
    provide: getRepositoryToken(ProjectEntity),
    useClass: ProjectRepositoryStub,
  },
  SchedulerRegistry,
  ...SchedulerLockServiceProviders,
];
