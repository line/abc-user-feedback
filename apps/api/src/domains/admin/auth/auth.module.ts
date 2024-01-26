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
import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { CodeModule } from '@/shared/code/code.module';
import { MailingModule } from '@/shared/mailing/mailing.module';
import type { ConfigServiceType } from '@/types/config-service.type';
import { ApiKeyModule } from '../project/api-key/api-key.module';
import { MemberModule } from '../project/member/member.module';
import { RoleModule } from '../project/role/role.module';
import { TenantModule } from '../tenant/tenant.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    forwardRef(() => CodeModule),
    forwardRef(() => UserModule),
    forwardRef(() => PassportModule),
    forwardRef(() => MailingModule),
    forwardRef(() => ApiKeyModule),
    forwardRef(() => TenantModule),
    forwardRef(() => RoleModule),
    forwardRef(() => MemberModule),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigServiceType>) => {
        const { secret } = configService.get('jwt', { infer: true });
        return { secret };
      },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
