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
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, JwtFromRequestFunction, Strategy } from 'passport-jwt';

import type { UserTypeEnum } from '@/domains/admin/user/entities/enums';
import type { ConfigServiceType } from '@/types/config-service.type';

interface IPayload {
  sub: string;
  email: string;
  type: UserTypeEnum;
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
  constructor(configService: ConfigService<ConfigServiceType>) {
    const { secret } = configService.get('jwt', { infer: true }) ?? {};

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    } as StrategyOptions);
  }

  validate(payload: IPayload) {
    const { email, sub, type } = payload;
    return { id: sub, email, type };
  }
}
