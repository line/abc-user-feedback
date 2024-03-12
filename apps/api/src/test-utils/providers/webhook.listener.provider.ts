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
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';

import { FeedbackEntity } from '@/domains/admin/feedback/feedback.entity';
import { IssueEntity } from '@/domains/admin/project/issue/issue.entity';
import { WebhookEntity } from '@/domains/admin/project/webhook/webhook.entity';
import { WebhookListener } from '@/domains/admin/project/webhook/webhook.listener';
import {
  FeedbackRepositoryStub,
  IssueRepositoryStub,
  WebhookRepositoryStub,
} from '../stubs';

export const WebhookListenerProviders = [
  WebhookListener,
  {
    provide: getRepositoryToken(WebhookEntity),
    useClass: WebhookRepositoryStub,
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
    provide: HttpService,
    useValue: {
      get: jest.fn(),
      post: jest.fn(),
    },
  },
];
