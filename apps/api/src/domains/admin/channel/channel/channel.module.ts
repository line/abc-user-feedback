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
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OpensearchRepository } from '@/common/repositories';
import { FeedbackModule } from '@/domains/admin/feedback/feedback.module';
import { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { ProjectModule } from '@/domains/admin/project/project/project.module';
import { FieldModule } from '../field/field.module';
import { ChannelController } from './channel.controller';
import { ChannelEntity } from './channel.entity';
import { ChannelMySQLService } from './channel.mysql.service';
import { ChannelService } from './channel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelEntity, ProjectEntity]),
    FieldModule,
    forwardRef(() => ProjectModule),
    forwardRef(() => FeedbackModule),
  ],
  providers: [ChannelMySQLService, ChannelService, OpensearchRepository],
  controllers: [ChannelController],
  exports: [ChannelService, ChannelMySQLService],
})
export class ChannelModule {}
