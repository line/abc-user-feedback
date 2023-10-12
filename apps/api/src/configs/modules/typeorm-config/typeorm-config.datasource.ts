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
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import type { DataSourceOptions } from 'typeorm';
import { DataSource } from 'typeorm';

import { mysqlConfig, mySqlConfigSchema } from '@/configs/mysql.config';
import { TypeOrmConfigService } from './typeorm-config.service';

dotenv.config();
process.env = mySqlConfigSchema.validateSync(process.env) as any;

const env = mysqlConfig();
console.log('env: ', env);
const configService = new ConfigService({ mysql: env });
const typeormConfigService = new TypeOrmConfigService(configService);
const typeormConfig =
  typeormConfigService.createTypeOrmOptions() as DataSourceOptions;

export default new DataSource(typeormConfig);
