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
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
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
  opensearchConfigSchema,
} from './configs/opensearch.config';
import { smtpConfig, smtpConfigSchema } from './configs/smtp.config';
import { AuthModule } from './domains/admin/auth/auth.module';
import { ChannelModule } from './domains/admin/channel/channel/channel.module';
import { FieldModule } from './domains/admin/channel/field/field.module';
import { OptionModule } from './domains/admin/channel/option/option.module';
import { FeedbackModule } from './domains/admin/feedback/feedback.module';
import { HistoryModule } from './domains/admin/history/history.module';
import { ApiKeyModule } from './domains/admin/project/api-key/api-key.module';
import { IssueTrackerModule } from './domains/admin/project/issue-tracker/issue-tracker.module';
import { IssueModule } from './domains/admin/project/issue/issue.module';
import { MemberModule } from './domains/admin/project/member/member.module';
import { ProjectModule } from './domains/admin/project/project/project.module';
import { RoleModule } from './domains/admin/project/role/role.module';
import { WebhookModule } from './domains/admin/project/webhook/webhook.module';
import { FeedbackIssueStatisticsModule } from './domains/admin/statistics/feedback-issue/feedback-issue-statistics.module';
import { FeedbackStatisticsModule } from './domains/admin/statistics/feedback/feedback-statistics.module';
import { IssueStatisticsModule } from './domains/admin/statistics/issue/issue-statistics.module';
import { TenantModule } from './domains/admin/tenant/tenant.module';
import { UserModule } from './domains/admin/user/user.module';
import { APIModule } from './domains/api/api.module';
import { HealthModule } from './domains/operation/health/health.module';
import { MigrationModule } from './domains/operation/migration/migration.module';
import { SchedulerLockModule } from './domains/operation/scheduler-lock/scheduler-lock.module';

export const domainModules = [
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
  WebhookModule,
  FeedbackStatisticsModule,
  IssueStatisticsModule,
  FeedbackIssueStatisticsModule,
  APIModule,
  SchedulerLockModule,
] as any[];

@Module({
  imports: [
    TypeOrmConfigModule,
    OpensearchConfigModule,
    MailerConfigModule,
    PrometheusModule.register(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, opensearchConfig, smtpConfig, jwtConfig, mysqlConfig],
      validationSchema: appConfigSchema
        .concat(jwtConfigSchema)
        .concat(mysqlConfigSchema)
        .concat(smtpConfigSchema)
        .concat(opensearchConfigSchema),
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
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ...domainModules,
  ],
})
export class AppModule {}
