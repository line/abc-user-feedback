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
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HistoryEntity } from './history.entity';
import { HistoryService } from './history.service';
import { ApiKeyHistorySubscriber } from './subscribers/api-key-history.subscriber';
import { ChannelHistorySubscriber } from './subscribers/channel-history.subscriber';
import { CodeHistorySubscriber } from './subscribers/code-history.subscriber';
import { FeedbackHistorySubscriber } from './subscribers/feedback-history.subscriber';
import { FeedbackIssueHistorySubscriber } from './subscribers/feedback-issue-history.subscriber';
import { FieldHistorySubscriber } from './subscribers/field-history.subscriber';
import { IssueHistorySubscriber } from './subscribers/issue-history.subscriber';
import { IssueTrackerHistorySubscriber } from './subscribers/issue-tracker-history.subscriber';
import { MemberHistorySubscriber } from './subscribers/member-history.subscriber';
import { OptionHistorySubscriber } from './subscribers/option-history.subscriber';
import { ProjectHistorySubscriber } from './subscribers/project-history.subscriber';
import { RoleHistorySubscriber } from './subscribers/role-history.subscriber';
import { TenantHistorySubscriber } from './subscribers/tenant-history.subscriber';
import { UserHistorySubscriber } from './subscribers/user-history.subscriber';
import { WebhookHistorySubscriber } from './subscribers/webhook-history.subscriber';

const subscribers = [
  ApiKeyHistorySubscriber,
  ChannelHistorySubscriber,
  FeedbackHistorySubscriber,
  FieldHistorySubscriber,
  IssueHistorySubscriber,
  IssueTrackerHistorySubscriber,
  MemberHistorySubscriber,
  OptionHistorySubscriber,
  ProjectHistorySubscriber,
  RoleHistorySubscriber,
  TenantHistorySubscriber,
  UserHistorySubscriber,
  FeedbackIssueHistorySubscriber,
  CodeHistorySubscriber,
  WebhookHistorySubscriber,
];
@Module({
  imports: [TypeOrmModule.forFeature([HistoryEntity])],
  providers: [HistoryService, ...subscribers],
  exports: [HistoryService],
})
export class HistoryModule {}
