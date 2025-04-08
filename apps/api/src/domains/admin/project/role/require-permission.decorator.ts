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
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards';
import type { PermissionEnum } from './permission.enum';
import { PermissionGuard } from './permission.guard';

export const PERMISSIONS_KEY = 'permissions';

export function RequirePermission(permission: PermissionEnum) {
  return applyDecorators(
    SetMetadata(PERMISSIONS_KEY, permission),
    UseGuards(JwtAuthGuard, PermissionGuard),
  );
}
