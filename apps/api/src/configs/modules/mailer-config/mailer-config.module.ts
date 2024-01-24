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
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { ConfigServiceType } from '@/types/config-service.type';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigServiceType>) => {
        const { host, password, port, username, sender } = configService.get(
          'smtp',
          { infer: true },
        );
        return {
          transport: {
            host,
            port,
            tls: { ciphers: 'SSLv3' },
            auth: username && password && { user: username, pass: password },
            secure: port === 465,
          },
          defaults: { from: `"User feedback" <${sender}>`, sdd: '' },
          template: {
            dir: __dirname + '/templates/',
            adapter: new HandlebarsAdapter(),
            options: { strict: true },
          },
        };
      },
    }),
  ],
})
export class MailerConfigModule {}
