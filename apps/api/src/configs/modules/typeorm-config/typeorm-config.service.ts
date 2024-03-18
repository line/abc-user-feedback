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
import { join } from 'path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import type { ConfigServiceType } from '@/types/config-service.type';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(
    private readonly configService: ConfigService<ConfigServiceType>,
  ) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const { main_url, sub_urls, auto_migration } = this.configService.get(
      'mysql',
      {
        infer: true,
      },
    );

    return {
      type: 'mysql',
      replication: {
        master: { url: main_url },
        slaves: sub_urls.length
          ? sub_urls.map((url) => ({ url }))
          : [{ url: main_url }],
      },
      entities: [join(__dirname, '../../../**/*.entity.{ts,js}')],
      migrations: [join(__dirname, 'migrations/*.{ts,js}')],
      migrationsTableName: 'migrations',
      logging: ['warn', 'error'],
      migrationsRun: auto_migration,
      namingStrategy: new SnakeNamingStrategy(),
      timezone: '+00:00',
    };
  }
}
