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
import { ClsModule } from 'nestjs-cls';
import { LoggerModule } from 'nestjs-pino';

import { appConfig, appConfigSchema } from './configs/app.config';
import { jwtConfig, jwtConfigSchema } from './configs/jwt.config';
import {
  MailerConfigModule,
  OpensearchConfigModule,
  TypeOrmConfigModule,
} from './configs/modules';
import { mysqlConfig, mysqlConfigSchema } from './configs/mysql.config';
import {
  opensearchConfig,
  opensearchSchema,
} from './configs/opensearch.config';
import { smtpConfig, smtpConfigSchema } from './configs/smtp.config';
import { AuthModule } from './domains/auth/auth.module';
import { ChannelModule } from './domains/channel/channel/channel.module';
import { FieldModule } from './domains/channel/field/field.module';
import { OptionModule } from './domains/channel/option/option.module';
import { FeedbackModule } from './domains/feedback/feedback.module';
import { HealthModule } from './domains/health/health.module';
import { HistoryModule } from './domains/history/history.module';
import { MigrationModule } from './domains/migration/migration.module';
import { ApiKeyModule } from './domains/project/api-key/api-key.module';
import { IssueTrackerModule } from './domains/project/issue-tracker/issue-tracker.module';
import { IssueModule } from './domains/project/issue/issue.module';
import { MemberModule } from './domains/project/member/member.module';
import { ProjectModule } from './domains/project/project/project.module';
import { RoleModule } from './domains/project/role/role.module';
import { TenantModule } from './domains/tenant/tenant.module';
import { UserModule } from './domains/user/user.module';

const domainModules = [
  AuthModule,
  ChannelModule,
  FieldModule,
  OptionModule,
  FeedbackModule,
  HealthModule,
  MigrationModule,
  ApiKeyModule,
  IssueTrackerModule,
  IssueModule,
  ProjectModule,
  RoleModule,
  TenantModule,
  UserModule,
  MemberModule,
  HistoryModule,
];

@Module({
  imports: [
    TypeOrmConfigModule,
    OpensearchConfigModule,
    MailerConfigModule,
    PrometheusModule.register(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, opensearchConfig, smtpConfig, jwtConfig, mysqlConfig],
      validate: (config) => ({
        ...appConfigSchema.validateSync(config),
        ...opensearchSchema.validateSync(config),
        ...smtpConfigSchema.validateSync(config),
        ...jwtConfigSchema.validateSync(config),
        ...mysqlConfigSchema.validateSync(config),
      }),
      validationOptions: { abortEarly: true },
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: { target: 'pino-pretty', options: { singleLine: true } },
        autoLogging: {
          ignore: (req: any) => req.originalUrl === '/api/health',
        },
        customLogLevel: (req, res, err) => {
          if (res.statusCode === 401) {
            return 'silent';
          }
          if (res.statusCode >= 400 && res.statusCode < 500) {
            return 'warn';
          } else if (res.statusCode >= 500 || err) {
            return 'error';
          }
          return 'info';
        },
      },
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    ...domainModules,
  ],
})
export class AppModule {}
