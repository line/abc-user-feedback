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
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { isWithinProjectScope } from '@/domains/admin/auth/guards/project-scope';
import { UserTypeEnum } from '@/domains/admin/user/entities/enums';
import { UserEntity } from '../../user/entities/user.entity';
import type { PermissionEnum } from './permission.enum';
import { PERMISSIONS_KEY } from './require-permission.decorator';
import { RoleEntity } from './role.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<
      PermissionEnum | undefined
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    const {
      user,
      params,
      query,
    }: {
      user: UserEntity;
      params: Record<string, string | undefined>;
      query: Record<string, unknown> | undefined;
    } = context.switchToHttp().getRequest();

    if (user.type === UserTypeEnum.SUPER) return true;

    const queryProjectId =
      typeof query?.projectId === 'string' ? query.projectId : undefined;
    const projectId = params.projectId ?? queryProjectId;
    if (!projectId || !Number.isInteger(Number(projectId)))
      throw new BadRequestException('projectId is required');

    const roleRepo = this.dataSource.getRepository(RoleEntity);
    const role = await roleRepo.findOne({
      where: {
        members: { user: { id: user.id } },
        project: { id: Number(projectId) },
      },
    });

    if (!role) return false;
    if (requiredPermission && !role.permissions.includes(requiredPermission))
      return false;

    return isWithinProjectScope(this.dataSource, { ...params, projectId });
  }
}
