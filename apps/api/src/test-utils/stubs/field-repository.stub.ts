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

import { fieldsFixture } from '../fixtures';
import { createQueryBuilder, removeUndefinedValues } from '../util-functions';

export class FieldRepositoryStub {
  field = fieldsFixture[0];
  findOne() {
    return this.field;
  }

  findOneBy() {
    return this.field;
  }

  find() {
    return [this.field];
  }

  findBy() {
    return [this.field];
  }

  findAndCount() {
    return [[this.field], 1];
  }

  findAndCountBy() {
    return [[this.field], 1];
  }

  save(field) {
    const fieldToSave = removeUndefinedValues(field);
    if (Array.isArray(fieldToSave)) {
      return fieldToSave.map((e) => ({
        ...this.field,
        ...e,
        id: faker.number.int(),
      }));
    } else {
      return {
        ...this.field,
        ...fieldToSave,
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
    this.field = null;
  }

  createQueryBuilder() {
    createQueryBuilder.getMany = () => fieldsFixture;
    return createQueryBuilder;
  }
}
