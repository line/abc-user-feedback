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

import { feedbackFixture } from '../fixtures';
import { createQueryBuilder, removeUndefinedValues } from '../util-functions';

export class FeedbackRepositoryStub {
  feedback = feedbackFixture;
  findOne() {
    return this.feedback;
  }

  findOneBy() {
    return this.feedback;
  }

  find() {
    return [this.feedback];
  }

  findBy() {
    return [this.feedback];
  }

  findAndCount() {
    return [[this.feedback], 1];
  }

  findAndCountBy() {
    return [[this.feedback], 1];
  }

  save(feedback) {
    const feedbackToSave = removeUndefinedValues(feedback);
    if (Array.isArray(feedbackToSave)) {
      return feedbackToSave.map((e) => ({
        ...this.feedback,
        ...e,
        id: faker.number.int(),
      }));
    } else {
      return {
        ...this.feedback,
        ...feedbackToSave,
      };
    }
  }

  count() {
    return 1;
  }

  createQueryBuilder() {
    createQueryBuilder.getMany = () => [this.feedback];
    return createQueryBuilder;
  }
}
