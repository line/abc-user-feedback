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

import {
  UserStateEnum,
  UserTypeEnum,
} from '@/domains/admin/user/entities/enums';
import type { UserEntity } from '@/domains/admin/user/entities/user.entity';
import type { UserService } from '@/domains/admin/user/user.service';
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
  tokenVersion: 3,
  iat: 0,
  exp: 0,
};

const activeUser = {
  id: 1,
  email: 'user@example.com',
  type: UserTypeEnum.GENERAL,
  state: UserStateEnum.Active,
  tokenVersion: 3,
} as UserEntity;

const mockUserService = (user: UserEntity | null) =>
  ({
    findTokenOwnerById: jest.fn().mockResolvedValue(user),
  }) as unknown as UserService;

describe('JWT token type', () => {
  it('access strategy accepts only access tokens', async () => {
    const strategy = new JwtStrategy(
      configService,
      mockUserService(activeUser),
    );

    await expect(
      strategy.validate({ ...basePayload, tokenType: 'access' }),
    ).resolves.toEqual({
      id: '1',
      email: 'user@example.com',
      type: UserTypeEnum.GENERAL,
    });
    await expect(
      strategy.validate({ ...basePayload, tokenType: 'refresh' }),
    ).rejects.toThrow(UnauthorizedException);
    await expect(strategy.validate(basePayload)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('refresh strategy accepts only refresh tokens', async () => {
    const strategy = new JwtRefreshStrategy(
      configService,
      mockUserService(activeUser),
    );

    await expect(
      strategy.validate({ ...basePayload, tokenType: 'refresh' }),
    ).resolves.toEqual({ id: '1', email: 'user@example.com' });
    await expect(
      strategy.validate({ ...basePayload, tokenType: 'access' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});

describe('JWT token version', () => {
  const strategies = (user: UserEntity | null) => [
    {
      strategy: new JwtStrategy(configService, mockUserService(user)),
      tokenType: 'access' as const,
    },
    {
      strategy: new JwtRefreshStrategy(configService, mockUserService(user)),
      tokenType: 'refresh' as const,
    },
  ];

  it('rejects tokens issued before the token version was bumped', async () => {
    for (const { strategy, tokenType } of strategies({
      ...activeUser,
      tokenVersion: 4,
    } as UserEntity)) {
      await expect(
        strategy.validate({ ...basePayload, tokenType }),
      ).rejects.toThrow(new UnauthorizedException('Token revoked'));
    }
  });

  it('rejects tokens without a token version', async () => {
    const { tokenVersion: _, ...legacyPayload } = basePayload;
    for (const { strategy, tokenType } of strategies(activeUser)) {
      await expect(
        strategy.validate({ ...legacyPayload, tokenType }),
      ).rejects.toThrow(new UnauthorizedException('Token revoked'));
    }
  });

  it('rejects tokens of a deleted user', async () => {
    for (const { strategy, tokenType } of strategies(null)) {
      await expect(
        strategy.validate({ ...basePayload, tokenType }),
      ).rejects.toThrow(new UnauthorizedException('Token revoked'));
    }
  });

  it('rejects tokens of a blocked user', async () => {
    for (const { strategy, tokenType } of strategies({
      ...activeUser,
      state: UserStateEnum.Blocked,
    } as UserEntity)) {
      await expect(
        strategy.validate({ ...basePayload, tokenType }),
      ).rejects.toThrow(new UnauthorizedException('User blocked'));
    }
  });

  it('uses the current user type rather than the one in the token', async () => {
    const strategy = new JwtStrategy(
      configService,
      mockUserService({
        ...activeUser,
        type: UserTypeEnum.SUPER,
      } as UserEntity),
    );

    await expect(
      strategy.validate({ ...basePayload, tokenType: 'access' }),
    ).resolves.toMatchObject({ type: UserTypeEnum.SUPER });
  });
});
