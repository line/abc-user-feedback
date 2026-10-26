/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
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
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';

import type { UserTypeEnum } from '@/domains/admin/user/entities/enums';
import { UserService } from '@/domains/admin/user/user.service';
import type { ConfigServiceType } from '@/types/config-service.type';
import { findCurrentTokenUser } from './token-version';

interface IPayload {
  sub: string;
  email: string;
  type: UserTypeEnum;
  tokenType?: 'access' | 'refresh';
  tokenVersion?: number;
  iat: number;
  exp: number;
}

interface StrategyOptions {
  jwtFromRequest: JwtFromRequestFunction;
  ignoreExpiration: boolean;
  secretOrKey: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService<ConfigServiceType>,
    private readonly userService: UserService,
  ) {
    const { secret } = configService.get('jwt', { infer: true }) ?? {};

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    } as StrategyOptions);
  }

  async validate(payload: IPayload) {
    // Refresh tokens are signed with the same secret; they must not work as access tokens.
    if (payload.tokenType !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }
    const { email, type } = await findCurrentTokenUser(
      this.userService,
      payload,
    );
    return { id: payload.sub, email, type };
  }
}
