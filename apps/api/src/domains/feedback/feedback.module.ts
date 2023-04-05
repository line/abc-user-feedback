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

import { ProjectController } from './controllers';
import { ChannelController } from './controllers/channel.controller';
import { FeedbackController } from './controllers/feedback.controller';
import { FieldController } from './controllers/field.controller';
import { OptionController } from './controllers/option.controller';
import { ChannelEntity } from './entities/channel.entity';
import { FieldEntity } from './entities/field.entity';
import { OptionEntity } from './entities/option.entity';
import { ProjectEntity } from './entities/project.entity';
import { ElasticsearchRepository } from './repositories';
import { ChannelService } from './services/channel.service';
import { FeedbackService } from './services/feedback.service';
import { FieldService } from './services/field.service';
import { OptionService } from './services/option.service';
import { ProjectService } from './services/project.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectEntity,
      ChannelEntity,
      FieldEntity,
      OptionEntity,
    ]),
  ],
  providers: [
    ProjectService,
    ChannelService,
    FieldService,
    OptionService,
    FeedbackService,
    ElasticsearchRepository,
  ],
  controllers: [
    ProjectController,
    ChannelController,
    FieldController,
    FeedbackController,
    OptionController,
  ],
})
export class FeedbackModule {}
