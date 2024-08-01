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

import { OptionEntity } from '@/domains/admin/channel/option/option.entity';
import { optionFixture } from '../fixtures';
import { createQueryBuilder, removeUndefinedValues } from '../util-functions';

export class OptionRepositoryStub {
  option: OptionEntity | null = optionFixture;
  findOne() {
    return this.option;
  }

  findOneBy() {
    return this.option;
  }

  find() {
    return [this.option];
  }

  findBy() {
    return [this.option];
  }

  findAndCount() {
    return [[this.option], 1];
  }

  findAndCountBy() {
    return [[this.option], 1];
  }

  save(option) {
    const optionToSave = removeUndefinedValues(option);
    if (Array.isArray(optionToSave)) {
      return optionToSave.map((e) => ({
        ...this.option,
        ...e,
        id: faker.number.int(),
      }));
    } else {
      return {
        ...this.option,
        ...optionToSave,
      };
    }
  }

  count() {
    return 1;
  }

  remove({ id }) {
    return { id };
  }

  query() {}

  setNull() {
    this.option = null;
  }

  createQueryBuilder() {
    createQueryBuilder.getMany = () => [optionFixture];
    return createQueryBuilder;
  }
}
