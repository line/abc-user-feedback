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
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { UserTypeEnum } from '@/domains/admin/user/entities/enums';
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
    const requiredPermission = this.reflector.getAllAndOverride<PermissionEnum>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission) return true;

    const { user, params } = context.switchToHttp().getRequest();

    if (user.type === UserTypeEnum.SUPER) return true;

    if (!params.projectId)
      throw new BadRequestException('projectId is required in params');

    const roleRepo = this.dataSource.getRepository(RoleEntity);
    const role = await roleRepo.findOne({
      where: {
        members: { user: { id: user.id } },
        project: { id: params.projectId },
      },
    });

    if (!role) return false;
    return role.permissions.includes(requiredPermission);
  }
}
