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

import { UserStateEnum } from '@/domains/admin/user/entities/enums';
import type { UserService } from '@/domains/admin/user/user.service';

/**
 * Looks up the token's user and rejects the token if the user is gone or
 * blocked, or if the token was issued before the user's tokenVersion was bumped
 * (password change, user type change, sign-out everywhere). Tokens issued
 * before tokenVersion existed carry no version and are rejected as well.
 */
export async function findCurrentTokenUser(
  userService: UserService,
  payload: { sub: string | number; tokenVersion?: number },
) {
  if (typeof payload.tokenVersion !== 'number') {
    throw new UnauthorizedException('Token revoked');
  }
  const user = await userService.findTokenOwnerById(Number(payload.sub));
  if (user?.tokenVersion !== payload.tokenVersion) {
    throw new UnauthorizedException('Token revoked');
  }
  if (user.state === UserStateEnum.Blocked) {
    throw new UnauthorizedException('User blocked');
  }

  return user;
}
