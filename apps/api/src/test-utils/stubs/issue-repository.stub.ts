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

import { IssueStatusEnum } from '@/common/enums';
import { issueFixture } from '../fixtures';
import { createQueryBuilder, removeUndefinedValues } from '../util-functions';

export class IssueRepositoryStub {
  issue = issueFixture;
  findOne() {
    return this.issue;
  }

  findOneBy() {
    return this.issue;
  }

  find() {
    return [this.issue];
  }

  findBy() {
    return [this.issue];
  }

  findAndCount() {
    return [[this.issue], 1];
  }

  findAndCountBy() {
    return [[this.issue], 1];
  }

  save(issue) {
    const issueToSave = removeUndefinedValues(issue);
    if (Array.isArray(issueToSave)) {
      return issueToSave.map((e) => ({
        ...this.issue,
        ...e,
        id: faker.number.int(),
        status: e.status || IssueStatusEnum.INIT,
        feedbackCount: e.feedbackCount || 0,
      }));
    } else {
      return {
        ...this.issue,
        ...issueToSave,
        status: issueToSave.status || IssueStatusEnum.INIT,
        feedbackCount: issueToSave.feedbackCount || 0,
      };
    }
  }

  update(issue) {
    const issueToUpdate = removeUndefinedValues(issue);
    if (Array.isArray(issueToUpdate)) {
      return issueToUpdate.map((e) => ({
        ...this.issue,
        ...e,
      }));
    } else {
      return {
        ...this.issue,
        ...issueToUpdate,
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
    this.issue = null;
  }

  createQueryBuilder() {
    createQueryBuilder.getMany = () => [issueFixture];
    return createQueryBuilder;
  }
}
