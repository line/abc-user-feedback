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

import type { EventTypeEnum } from '@/common/enums';
import type { WebhookEntity } from '@/domains/admin/project/webhook/webhook.entity';
import { webhookFixture } from '../fixtures';
import { CommonRepositoryStub } from './common-repository.stub';

export class WebhookRepositoryStub extends CommonRepositoryStub<WebhookEntity> {
  constructor() {
    super([webhookFixture]);
  }

  find(input?: {
    where: { events: { type: EventTypeEnum } };
  }): WebhookEntity[] | null {
    if (input?.where.events.type) {
      return (
        this.entities?.filter(
          (entity) =>
            entity.events.filter(
              (event) => event.type === input.where.events.type,
            ).length > 0,
        ) ?? null
      );
    }
    return this.entities;
  }
}
