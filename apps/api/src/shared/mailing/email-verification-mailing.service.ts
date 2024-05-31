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
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { ConfigServiceType } from '@/types/config-service.type';
import type { SendMailDto } from './send-mail.dto';

@Injectable()
export class EmailVerificationMailingService {
  private readonly baseUrl: string;
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<ConfigServiceType>,
  ) {
    this.baseUrl = this.configService.get('smtp', { infer: true }).baseUrl;
  }
  async send({ code, email }: SendMailDto) {
    await this.mailerService.sendMail({
      to: email,
      subject: `User feedback Email Verification`,
      context: { code, baseUrl: this.baseUrl },
      template: 'verification',
    });
  }
}
