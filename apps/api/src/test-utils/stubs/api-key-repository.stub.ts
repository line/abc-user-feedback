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

import { ApiKeyEntity } from '@/domains/admin/project/api-key/api-key.entity';
import { apiKeyFixture } from '../fixtures';
import { createQueryBuilder, removeUndefinedValues } from '../util-functions';

export class ApiKeyRepositoryStub {
  apiKey: ApiKeyEntity | null = apiKeyFixture;
  findOne() {
    return this.apiKey;
  }

  findOneBy() {
    return this.apiKey;
  }

  find() {
    return [this.apiKey];
  }

  findBy() {
    return [this.apiKey];
  }

  findAndCount() {
    return [[this.apiKey], 1];
  }

  findAndCountBy() {
    return [[this.apiKey], 1];
  }

  save(apiKey) {
    const apiKeyToSave = removeUndefinedValues(apiKey);
    if (Array.isArray(apiKeyToSave)) {
      return apiKeyToSave.map((e) => ({
        ...this.apiKey,
        ...e,
        id: faker.number.int(),
      }));
    } else {
      return {
        ...this.apiKey,
        ...apiKeyToSave,
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
    this.apiKey = null;
  }

  createQueryBuilder() {
    createQueryBuilder.getMany = () => [apiKeyFixture];
    return createQueryBuilder;
  }
}
