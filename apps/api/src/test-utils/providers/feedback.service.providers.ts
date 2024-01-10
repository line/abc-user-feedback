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
import { ClsService } from 'nestjs-cls';

import { OpensearchRepository } from '@/common/repositories';
import {
  getMockProvider,
  MockOpensearchRepository,
} from '@/test-utils/util-functions';
import { FeedbackEntity } from '../../domains/admin/feedback/feedback.entity';
import { FeedbackMySQLService } from '../../domains/admin/feedback/feedback.mysql.service';
import { FeedbackOSService } from '../../domains/admin/feedback/feedback.os.service';
import { FeedbackService } from '../../domains/admin/feedback/feedback.service';
import { FeedbackRepositoryStub } from '../stubs/feedback.repository.stub';
import { ChannelServiceProviders } from './channel.service.providers';
import { FeedbackIssueStatisticsServiceProviders } from './feedback-issue-statistics.service.providers';
import { FeedbackStatisticsServiceProviders } from './feedback-statistics.service.providers';
import { FieldServiceProviders } from './field.service.providers';
import { IssueServiceProviders } from './issue.service.providers';
import { OptionServiceProviders } from './option.service.providers';

export const FeedbackServiceProviders = [
  FeedbackService,
  FeedbackMySQLService,
  {
    provide: getRepositoryToken(FeedbackEntity),
    useClass: FeedbackRepositoryStub,
  },
  ClsService,
  ...FieldServiceProviders,
  ...IssueServiceProviders,
  ...OptionServiceProviders,
  ...ChannelServiceProviders,
  ...FeedbackStatisticsServiceProviders,
  ...FeedbackIssueStatisticsServiceProviders,
  getMockProvider(OpensearchRepository, MockOpensearchRepository),
  FeedbackOSService,
];
