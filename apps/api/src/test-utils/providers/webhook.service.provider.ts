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

import { ChannelEntity } from '@/domains/admin/channel/channel/channel.entity';
import { EventEntity } from '@/domains/admin/project/webhook/event.entity';
import { WebhookEntity } from '@/domains/admin/project/webhook/webhook.entity';
import { WebhookService } from '@/domains/admin/project/webhook/webhook.service';
import {
  ChannelRepositoryStub,
  EventRepositoryStub,
  WebhookRepositoryStub,
} from '../stubs';

export const WebhookServiceProviders = [
  WebhookService,
  {
    provide: getRepositoryToken(WebhookEntity),
    useClass: WebhookRepositoryStub,
  },
  {
    provide: getRepositoryToken(EventEntity),
    useClass: EventRepositoryStub,
  },
  {
    provide: getRepositoryToken(ChannelEntity),
    useClass: ChannelRepositoryStub,
  },
];
