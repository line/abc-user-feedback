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
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChannelEntity } from '../../channel/channel/channel.entity';
import { FeedbackEntity } from '../../feedback/feedback.entity';
import { IssueEntity } from '../issue/issue.entity';
import { EventEntity } from './event.entity';
import { WebhookController } from './webhook.controller';
import { WebhookEntity } from './webhook.entity';
import { WebhookListener } from './webhook.listener';
import { WebhookService } from './webhook.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WebhookEntity]),
    TypeOrmModule.forFeature([EventEntity]),
    TypeOrmModule.forFeature([ChannelEntity]),
    TypeOrmModule.forFeature([FeedbackEntity]),
    TypeOrmModule.forFeature([IssueEntity]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [WebhookController],
  providers: [WebhookService, WebhookListener],
  exports: [WebhookService],
})
export class WebhookModule {}
