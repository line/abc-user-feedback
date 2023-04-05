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
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

import { appConfig, appConfigSchema } from './configs/app.config';
import {
  elasticsearchConfig,
  elasticsearchSchema,
} from './configs/elasticsearch.config';
import { jwtConfig, jwtConfigSchema } from './configs/jwt.config';
import {
  ElasticsearchConfigModule,
  MailerConfigModule,
  TypeOrmConfigModule,
} from './configs/modules';
import { mySqlConfigSchema, mysqlConfig } from './configs/mysql.config';
import { smtpConfig, smtpConfigSchema } from './configs/smtp.config';
import { AuthModule } from './domains/auth/auth.module';
import { FeedbackModule } from './domains/feedback/feedback.module';
import { RoleModule } from './domains/role/role.module';
import { TenantModule } from './domains/tenant/tenant.module';
import { UserModule } from './domains/user/user.module';

const domainModules = [
  RoleModule,
  TenantModule,
  UserModule,
  AuthModule,
  FeedbackModule,
];

@Module({
  imports: [
    TypeOrmConfigModule,
    ElasticsearchConfigModule,
    MailerConfigModule,
    PrometheusModule.register(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        elasticsearchConfig,
        smtpConfig,
        jwtConfig,
        mysqlConfig,
      ],
      validate: (config) => ({
        ...appConfigSchema.validateSync(config),
        ...elasticsearchSchema.validateSync(config),
        ...smtpConfigSchema.validateSync(config),
        ...jwtConfigSchema.validateSync(config),
        ...mySqlConfigSchema.validateSync(config),
      }),
      validationOptions: { abortEarly: true },
    }),
    ...domainModules,
  ],
})
export class AppModule {}
