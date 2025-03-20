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

import type { MemberEntity } from '@/domains/admin/project/member/member.entity';
import { memberFixture } from '../fixtures';
import { removeUndefinedValues } from '../util-functions';
import { CommonRepositoryStub } from './common-repository.stub';

export class MemberRepositoryStub extends CommonRepositoryStub<MemberEntity> {
  save(member: Partial<MemberEntity> | Partial<MemberEntity>[]) {
    const memberToSave = removeUndefinedValues(member);
    const entity = this.entities?.[0] ?? memberFixture;
    if (Array.isArray(memberToSave)) {
      return memberToSave.map((e) => ({
        ...entity,
        ...e,
        role: { ...entity.role, ...e.role },
        user: { ...entity.user, ...e.user },
        id: faker.number.int(),
      }));
    } else {
      return {
        ...entity,
        role: { ...entity.role, ...memberToSave.role },
        user: { ...entity.user, ...memberToSave.user },
        ...memberToSave,
      };
    }
  }
}
