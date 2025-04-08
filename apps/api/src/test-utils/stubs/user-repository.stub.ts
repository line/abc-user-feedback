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
import { faker } from '@faker-js/faker';

import { UserTypeEnum } from '@/domains/admin/user/entities/enums';
import type { UserEntity } from '@/domains/admin/user/entities/user.entity';
import { userFixture } from '../fixtures';
import { removeUndefinedValues } from '../util-functions';
import { CommonRepositoryStub } from './common-repository.stub';

export class UserRepositoryStub extends CommonRepositoryStub<UserEntity> {
  constructor() {
    super([userFixture]);
  }
  save(user: Partial<UserEntity> | Partial<UserEntity>[]) {
    const userToSave = removeUndefinedValues(user);
    const entity = this.entities?.[0] ?? userFixture;

    if (Array.isArray(userToSave)) {
      return userToSave.map((e) => ({
        ...entity,
        ...e,
        type: e.type ?? UserTypeEnum.GENERAL,
        id: faker.number.int(),
      }));
    }
    return {
      ...entity,
      ...userToSave,
      type: userToSave.type ?? UserTypeEnum.GENERAL,
    };
  }
}
