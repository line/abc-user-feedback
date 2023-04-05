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

import { MailerConfigModule } from '@/configs/modules';

import { EmailVerificationMailingService } from './email-verification-mailing.service';
import { ResetPasswordMailingService } from './reset-password-mailing.service';
import { UserInvitationMailingService } from './user-invitation-mailing.service';

const services = [
  EmailVerificationMailingService,
  ResetPasswordMailingService,
  UserInvitationMailingService,
];

@Module({
  imports: [MailerConfigModule],
  providers: [...services],
  exports: [...services],
})
export class MailingModule {}
