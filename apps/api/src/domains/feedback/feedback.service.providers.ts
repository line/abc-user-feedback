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
  mockRepository,
} from '@/utils/test-utils';
import { ChannelServiceProviders } from '../channel/channel/channel.service.providers';
import { FieldServiceProviders } from '../channel/field/field.service.providers';
import { OptionServiceProviders } from '../channel/option/option.service.providers';
import { IssueServiceProviders } from '../project/issue/issue.service.providers';
import { FeedbackEntity } from './feedback.entity';
import { FeedbackMySQLService } from './feedback.mysql.service';
import { FeedbackOSService } from './feedback.os.service';
import { FeedbackService } from './feedback.service';

export const FeedbackServiceProviders = [
  FeedbackService,
  FeedbackMySQLService,
  {
    provide: getRepositoryToken(FeedbackEntity),
    useValue: mockRepository(),
  },
  ClsService,
  ...FieldServiceProviders,
  ...IssueServiceProviders,
  ...OptionServiceProviders,
  ...ChannelServiceProviders,
  getMockProvider(OpensearchRepository, MockOpensearchRepository),
  FeedbackOSService,
];
