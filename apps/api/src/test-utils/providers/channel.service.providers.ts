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
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';

import { OpensearchRepository } from '@/common/repositories';
import { ProjectServiceProviders } from '@/test-utils/providers/project.service.providers';
import {
  getMockProvider,
  MockOpensearchRepository,
  mockRepository,
} from '@/test-utils/util-functions';
import { ChannelEntity } from '../../domains/admin/channel/channel/channel.entity';
import { ChannelMySQLService } from '../../domains/admin/channel/channel/channel.mysql.service';
import { ChannelService } from '../../domains/admin/channel/channel/channel.service';
import { FieldServiceProviders } from './field.service.providers';

export const ChannelServiceProviders = [
  ChannelService,
  ChannelMySQLService,
  {
    provide: getRepositoryToken(ChannelEntity),
    useValue: mockRepository(),
  },
  getMockProvider(OpensearchRepository, MockOpensearchRepository),
  ...ProjectServiceProviders,
  ...FieldServiceProviders,
  ConfigService,
];
