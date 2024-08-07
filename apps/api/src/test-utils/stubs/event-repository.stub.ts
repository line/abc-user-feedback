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

import { EventEntity } from '@/domains/admin/project/webhook/event.entity';
import { eventFixture } from '../fixtures';
import { createQueryBuilder, removeUndefinedValues } from '../util-functions';

export class EventRepositoryStub {
  event: EventEntity | null = eventFixture;
  findOne() {
    return this.event;
  }

  findOneBy() {
    return this.event;
  }

  find() {
    return [this.event];
  }

  findBy() {
    return [this.event];
  }

  findAndCount() {
    return [[this.event], 1];
  }

  findAndCountBy() {
    return [[this.event], 1];
  }

  save(event) {
    const eventToSave = removeUndefinedValues(event);
    if (Array.isArray(eventToSave)) {
      return eventToSave.map((e) => ({
        ...this.event,
        ...e,
        id: faker.number.int(),
      }));
    } else {
      return {
        ...this.event,
        ...eventToSave,
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
    this.event = null;
  }

  createQueryBuilder() {
    createQueryBuilder.getMany = () => [eventFixture];
    return createQueryBuilder;
  }
}
