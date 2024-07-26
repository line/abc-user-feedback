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

import type { CodeTypeEnum } from '@/shared/code/code-type.enum';
import { CodeEntity } from '@/shared/code/code.entity';

import { codeFixture } from '../fixtures';
import { createQueryBuilder, removeUndefinedValues } from '../util-functions';

export class CodeRepositoryStub {
  code: CodeEntity | null = codeFixture;
  findOne() {
    return this.code;
  }

  findOneBy() {
    return this.code;
  }

  find() {
    return [this.code];
  }

  findBy() {
    return [this.code];
  }

  findAndCount() {
    return [[this.code], 1];
  }

  findAndCountBy() {
    return [[this.code], 1];
  }

  save(code) {
    const codeToSave = removeUndefinedValues(code);
    if (Array.isArray(codeToSave)) {
      return codeToSave.map((e) => ({
        ...this.code,
        ...e,
        id: faker.number.int(),
      }));
    } else {
      return {
        ...this.code,
        ...codeToSave,
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
    this.code = null;
  }

  setIsVerified(bool) {
    if (this.code) this.code.isVerified = bool;
  }

  setType(type: CodeTypeEnum) {
    if (this.code) this.code.type = type;
  }

  setTryCount(tryCount) {
    if (this.code) this.code.tryCount = tryCount;
  }

  createQueryBuilder() {
    createQueryBuilder.getMany = () => [codeFixture];
    return createQueryBuilder;
  }
}
