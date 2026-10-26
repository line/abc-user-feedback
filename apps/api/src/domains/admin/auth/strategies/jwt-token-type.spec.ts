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
import { UnauthorizedException } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';

import { UserTypeEnum } from '@/domains/admin/user/entities/enums';
import type { ConfigServiceType } from '@/types/config-service.type';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { JwtStrategy } from './jwt.strategy';

const configService = {
  get: () => ({ secret: 'test-secret' }),
} as unknown as ConfigService<ConfigServiceType>;

const basePayload = {
  sub: '1',
  email: 'user@example.com',
  type: UserTypeEnum.GENERAL,
  iat: 0,
  exp: 0,
};

describe('JWT token type', () => {
  it('access strategy accepts only access tokens', () => {
    const strategy = new JwtStrategy(configService);

    expect(strategy.validate({ ...basePayload, tokenType: 'access' })).toEqual({
      id: '1',
      email: 'user@example.com',
      type: UserTypeEnum.GENERAL,
    });
    expect(() =>
      strategy.validate({ ...basePayload, tokenType: 'refresh' }),
    ).toThrow(UnauthorizedException);
    expect(() => strategy.validate(basePayload)).toThrow(UnauthorizedException);
  });

  it('refresh strategy accepts only refresh tokens', () => {
    const strategy = new JwtRefreshStrategy(configService);

    expect(strategy.validate({ ...basePayload, tokenType: 'refresh' })).toEqual(
      { id: '1', email: 'user@example.com' },
    );
    expect(() =>
      strategy.validate({ ...basePayload, tokenType: 'access' }),
    ).toThrow(UnauthorizedException);
  });
});
