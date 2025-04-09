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

import { IssueStatusEnum } from '@/common/enums';
import type { IssueEntity } from '@/domains/admin/project/issue/issue.entity';
import { issueFixture } from '../fixtures';
import { removeUndefinedValues } from '../util-functions';
import { CommonRepositoryStub } from './common-repository.stub';

export class IssueRepositoryStub extends CommonRepositoryStub<IssueEntity> {
  constructor() {
    super([issueFixture]);
  }

  save(issue: Partial<IssueEntity> | Partial<IssueEntity>[]) {
    const issueToSave = removeUndefinedValues(issue);
    if (Array.isArray(issueToSave)) {
      return issueToSave.map((e) => ({
        ...this.entities?.[0],
        ...e,
        id: faker.number.int(),
        status: e.status ?? IssueStatusEnum.INIT,
        feedbackCount: e.feedbackCount ?? 0,
      }));
    } else {
      return {
        ...this.entities?.[0],
        ...issueToSave,
        status: issueToSave.status ?? IssueStatusEnum.INIT,
        feedbackCount: issueToSave.feedbackCount ?? 0,
      };
    }
  }
}
