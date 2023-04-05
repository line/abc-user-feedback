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
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ElasticsearchModuleOptions,
  ElasticsearchService,
} from '@nestjs/elasticsearch';

import { ConfigServiceType } from '@/types/config-service.type';

export const ELASTICSEARCH_MODULE_OPTIONS = 'ELASTICSEARCH_MODULE_OPTIONS';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: ELASTICSEARCH_MODULE_OPTIONS,
      useFactory: (
        configService: ConfigService<ConfigServiceType>,
      ): ElasticsearchModuleOptions => {
        const { node, password, username } = configService.get(
          'elasticsearch',
          { infer: true },
        );
        return { node, auth: { username, password } };
      },
      inject: [ConfigService],
    },
    ElasticsearchService,
  ],
  exports: [ElasticsearchService],
})
export class ElasticsearchConfigModule {}
