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
import type { ExecutionContext } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { DataSource } from 'typeorm';

import { UserTypeEnum } from '../../user/entities/enums';
import { PermissionEnum } from './permission.enum';
import { PermissionGuard } from './permission.guard';

const createContext = (request: object) =>
  ({
    getHandler: () => undefined,
    getClass: () => undefined,
    switchToHttp: () => ({ getRequest: () => request }),
  }) as unknown as ExecutionContext;

const createGuard = (
  permission: PermissionEnum | undefined,
  role: { permissions: PermissionEnum[] } | null,
) => {
  const reflector = new Reflector();
  jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(permission);
  const findOne = jest.fn().mockResolvedValue(role);
  const exists = jest.fn().mockResolvedValue(true);
  const dataSource = {
    getRepository: () => ({ findOne, exists }),
  } as unknown as DataSource;
  return { guard: new PermissionGuard(reflector, dataSource), findOne };
};

const generalUser = { id: 1, type: UserTypeEnum.GENERAL };

describe('PermissionGuard', () => {
  it('allows SUPER users without a role lookup', async () => {
    const { guard, findOne } = createGuard(PermissionEnum.issue_update, null);

    await expect(
      guard.canActivate(
        createContext({
          user: { id: 1, type: UserTypeEnum.SUPER },
          params: {},
        }),
      ),
    ).resolves.toBe(true);
    expect(findOne).not.toHaveBeenCalled();
  });

  it('rejects a member whose role lacks the permission', async () => {
    const { guard } = createGuard(PermissionEnum.issue_update, {
      permissions: [PermissionEnum.issue_create],
    });

    await expect(
      guard.canActivate(
        createContext({ user: generalUser, params: { projectId: '1' } }),
      ),
    ).resolves.toBe(false);
  });

  it('allows any member when no permission is required', async () => {
    const { guard } = createGuard(undefined, { permissions: [] });

    await expect(
      guard.canActivate(
        createContext({ user: generalUser, params: { projectId: '1' } }),
      ),
    ).resolves.toBe(true);
  });

  it('rejects a user who is not a member of the project', async () => {
    const { guard } = createGuard(undefined, null);

    await expect(
      guard.canActivate(
        createContext({ user: generalUser, params: { projectId: '1' } }),
      ),
    ).resolves.toBe(false);
  });

  it('reads projectId from the query when the route has no such param', async () => {
    const { guard, findOne } = createGuard(undefined, { permissions: [] });

    await expect(
      guard.canActivate(
        createContext({
          user: generalUser,
          params: {},
          query: { projectId: '7' },
        }),
      ),
    ).resolves.toBe(true);
    expect(findOne).toHaveBeenCalledWith({
      where: { members: { user: { id: 1 } }, project: { id: 7 } },
    });
  });

  it('rejects a request without a valid projectId', async () => {
    const { guard } = createGuard(undefined, { permissions: [] });

    await expect(
      guard.canActivate(
        createContext({
          user: generalUser,
          params: {},
          query: { projectId: 'abc' },
        }),
      ),
    ).rejects.toThrow(BadRequestException);
  });
});
