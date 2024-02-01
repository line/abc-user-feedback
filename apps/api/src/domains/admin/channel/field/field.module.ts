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

import { OpensearchRepository } from '@/common/repositories';
import { OptionEntity } from '../option/option.entity';
import { OptionModule } from '../option/option.module';
import { FieldEntity } from './field.entity';
import { FieldMySQLService } from './field.mysql.service';
import { FieldService } from './field.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FieldEntity, OptionEntity]),
    OptionModule,
  ],
  providers: [OpensearchRepository, FieldService, FieldMySQLService],
  exports: [FieldService, FieldMySQLService],
})
export class FieldModule {}
