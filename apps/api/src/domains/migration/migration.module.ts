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
import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OpensearchRepository } from '@/common/repositories';
import { OS_USE } from '@/configs/opensearch.config';

import { ChannelEntity } from '../channel/channel/channel.entity';
import { FieldEntity } from '../channel/field/field.entity';
import { FieldModule } from '../channel/field/field.module';
import { OptionEntity } from '../channel/option/option.entity';
import { OptionModule } from '../channel/option/option.module';
import { FeedbackEntity } from '../feedback/feedback.entity';
import { MigrationController } from './migration.controller';
import { MigrationService } from './migration.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChannelEntity,
      FeedbackEntity,
      FieldEntity,
      OptionEntity,
    ]),
    FieldModule,
    OptionModule,
  ],
  providers: [MigrationService, OpensearchRepository],
  controllers: [MigrationController],
})
export class MigrationModule implements OnModuleInit {
  constructor(private readonly migrtaionService: MigrationService) {}
  async onModuleInit() {
    if (OS_USE) {
      await this.migrtaionService.migrateToES();
    }
  }
}
