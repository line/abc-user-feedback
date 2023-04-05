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
import { DataSource } from 'typeorm';

import { PermissionEnum } from '@/domains/role/permission.enum';
import {
  DefaultRole,
  GUEST_ROLE_DEFAULT_ID,
  OWNER_ROLE_DEFAULT_ID,
} from '@/domains/role/role.constant';
import { RoleEntity } from '@/domains/role/role.entity';

export default async (dataSource: DataSource) => {
  const queryRunner = dataSource.createQueryRunner();
  const roleRepo = queryRunner.connection.getRepository(RoleEntity);

  // owner
  let ownerRole = await roleRepo.findOneBy({ name: DefaultRole.Owner });
  if (!ownerRole) {
    ownerRole = roleRepo.create({
      id: OWNER_ROLE_DEFAULT_ID,
      name: DefaultRole.Owner,
      permissions: Object.values(PermissionEnum),
    });
    await roleRepo.save(ownerRole);
  }

  // guest
  let guestRole = await roleRepo.findOneBy({ name: DefaultRole.Guest });
  if (!guestRole) {
    guestRole = roleRepo.create({
      id: GUEST_ROLE_DEFAULT_ID,
      name: DefaultRole.Guest,
      permissions: [],
    });
    await roleRepo.save(guestRole);
  }
};
