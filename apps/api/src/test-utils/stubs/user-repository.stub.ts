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
import { faker } from '@faker-js/faker';

import { userFixture } from '../fixtures';
import { createQueryBuilder, removeUndefinedValues } from '../util-functions';

export class UserRepositoryStub {
  user = userFixture;
  findOne({ where: { email, signUpMethod } }) {
    return { ...this.user, email, signUpMethod };
  }

  findOneBy({ email, signUpMethod }) {
    return { ...this.user, email, signUpMethod };
  }

  find({ where: { email, signUpMethod } }) {
    return [{ ...this.user, email, signUpMethod }];
  }

  findBy({ email, signUpMethod }) {
    return [{ ...this.user, email, signUpMethod }];
  }

  findAndCount({ where: { email, signUpMethod } }) {
    return [[{ ...this.user, email, signUpMethod }], 1];
  }

  findAndCountBy({ where: { email, signUpMethod } }) {
    return [[{ ...this.user, email, signUpMethod }], 1];
  }

  save(user) {
    const userToSave = removeUndefinedValues(user);
    if (Array.isArray(userToSave)) {
      return userToSave.map((e) => ({
        ...this.user,
        ...e,
        id: faker.number.int(),
      }));
    } else {
      return {
        ...this.user,
        ...userToSave,
      };
    }
  }

  count() {
    return 1;
  }

  createQueryBuilder() {
    createQueryBuilder.getMany = () => [this.user];
    return createQueryBuilder;
  }
}
