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
import { getRepositoryToken } from '@nestjs/typeorm';

import { OpensearchRepository } from '@/common/repositories';
import { ChannelEntity } from '@/domains/admin/channel/channel/channel.entity';
import {
  getMockProvider,
  MockOpensearchRepository,
} from '@/test-utils/util-functions';
import { ProjectEntity } from '../../domains/admin/project/project/project.entity';
import { ProjectService } from '../../domains/admin/project/project/project.service';
import { ChannelRepositoryStub, ProjectRepositoryStub } from '../stubs';
import { ApiKeyServiceProviders } from './api-key.service.providers';
import { FeedbackIssueStatisticsServiceProviders } from './feedback-issue-statistics.service.providers';
import { FeedbackStatisticsServiceProviders } from './feedback-statistics.service.providers';
import { IssueStatisticsServiceProviders } from './issue-statistics.service.providers';
import { IssueTrackerServiceProviders } from './issue-tracker.service.provider';
import { MemberServiceProviders } from './member.service.providers';
import { RoleServiceProviders } from './role.service.providers';

export const ProjectServiceProviders = [
  ProjectService,
  {
    provide: getRepositoryToken(ProjectEntity),
    useClass: ProjectRepositoryStub,
  },
  {
    provide: getRepositoryToken(ChannelEntity),
    useClass: ChannelRepositoryStub,
  },
  getMockProvider(OpensearchRepository, MockOpensearchRepository),
  ...RoleServiceProviders,
  ...MemberServiceProviders,
  ...ApiKeyServiceProviders,
  ...IssueTrackerServiceProviders,
  ...FeedbackStatisticsServiceProviders,
  ...IssueStatisticsServiceProviders,
  ...FeedbackIssueStatisticsServiceProviders,
];
