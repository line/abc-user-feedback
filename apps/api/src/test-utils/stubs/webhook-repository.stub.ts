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

import { webhookFixture } from '../fixtures';
import { createQueryBuilder } from '../util-functions';

export class WebhookRepositoryStub {
  webhook = webhookFixture;
  findOne() {
    return this.webhook;
  }

  findOneBy() {
    return this.webhook;
  }

  find() {
    return [this.webhook];
  }

  findBy() {
    return [this.webhook];
  }

  findAndCount() {
    return [[this.webhook], 1];
  }

  findAndCountBy() {
    return [[this.webhook], 1];
  }

  save(webhook) {
    if (Array.isArray(webhook)) {
      return webhook.map((w) => ({
        ...w,
        id: faker.number.int(),
        status: webhookFixture.status,
        project: { ...webhookFixture.project },
      }));
    } else {
      return {
        ...webhook,
        id: webhookFixture.id,
        status: webhookFixture.status,
        project: { ...webhookFixture.project },
      };
    }
  }

  count() {
    return 1;
  }

  remove({ id }) {
    return { id };
  }

  createQueryBuilder() {
    createQueryBuilder.getMany = () => [webhookFixture];
    return createQueryBuilder;
  }
}
