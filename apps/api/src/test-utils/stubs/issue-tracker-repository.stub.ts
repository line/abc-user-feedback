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

import { issueTrackerFixture } from '../fixtures';
import { createQueryBuilder, removeUndefinedValues } from '../util-functions';

export class IssueTrackerRepositoryStub {
  issueTracker = issueTrackerFixture;
  findOne() {
    return this.issueTracker;
  }

  findOneBy() {
    return this.issueTracker;
  }

  find() {
    return [this.issueTracker];
  }

  findBy() {
    return [this.issueTracker];
  }

  findAndCount() {
    return [[this.issueTracker], 1];
  }

  findAndCountBy() {
    return [[this.issueTracker], 1];
  }

  save(issueTracker) {
    const issueTrackerToSave = removeUndefinedValues(issueTracker);
    if (Array.isArray(issueTrackerToSave)) {
      return issueTrackerToSave.map((e) => ({
        ...this.issueTracker,
        ...e,
        id: faker.number.int(),
      }));
    } else {
      return {
        ...this.issueTracker,
        ...issueTrackerToSave,
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
    this.issueTracker = null;
  }

  createQueryBuilder() {
    createQueryBuilder.getMany = () => [issueTrackerFixture];
    return createQueryBuilder;
  }
}
