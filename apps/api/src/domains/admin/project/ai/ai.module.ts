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
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChannelEntity } from '../../channel/channel/channel.entity';
import { FieldEntity } from '../../channel/field/field.entity';
import { FeedbackEntity } from '../../feedback/feedback.entity';
import { FeedbackModule } from '../../feedback/feedback.module';
import { IssueEntity } from '../issue/issue.entity';
import { ProjectEntity } from '../project/project.entity';
import { RoleEntity } from '../role/role.entity';
import { AIFieldTemplatesEntity } from './ai-field-templates.entity';
import { AIIntegrationsEntity } from './ai-integrations.entity';
import { AIIssueTemplatesEntity } from './ai-issue-templates.entity';
import { AIUsagesEntity } from './ai-usages.entity';
import { AIController } from './ai.controller';
import { AIListener } from './ai.listener';
import { AIService } from './ai.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AIIntegrationsEntity,
      AIFieldTemplatesEntity,
      AIIssueTemplatesEntity,
      AIUsagesEntity,
      FeedbackEntity,
      IssueEntity,
      ProjectEntity,
      ChannelEntity,
      FieldEntity,
      RoleEntity,
    ]),
    FeedbackModule,
  ],
  providers: [AIService, AIListener],
  controllers: [AIController],
  exports: [AIService],
})
export class AIModule {
  constructor(private readonly service: AIService) {}
  async onModuleInit() {
    await this.service.addPermissions();
  }
}
