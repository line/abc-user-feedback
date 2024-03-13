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

import { memberFixture } from '../fixtures';
import { createQueryBuilder, removeUndefinedValues } from '../util-functions';

export class MemberRepositoryStub {
  member = memberFixture;
  findOne() {
    return this.member;
  }

  findOneBy() {
    return this.member;
  }

  find() {
    return [this.member];
  }

  findBy() {
    return [this.member];
  }

  findAndCount() {
    return [[this.member], 1];
  }

  findAndCountBy() {
    return [[this.member], 1];
  }

  save(member) {
    const memberToSave = removeUndefinedValues(member);
    if (Array.isArray(memberToSave)) {
      return memberToSave.map((e) => ({
        ...this.member,
        ...e,
        role: {
          ...this.member.role,
          ...e.role,
        },
        user: {
          ...this.member.user,
          ...e.user,
        },
        id: faker.number.int(),
      }));
    } else {
      return {
        ...this.member,
        role: {
          ...this.member.role,
          ...memberToSave.role,
        },
        user: {
          ...this.member.user,
          ...memberToSave.user,
        },
        ...memberToSave,
      };
    }
  }

  count() {
    return 1;
  }

  remove({ id }) {
    return { id };
  }

  setNull() {
    this.member = null;
  }

  createQueryBuilder() {
    createQueryBuilder.getMany = () => [memberFixture];
    return createQueryBuilder;
  }
}
