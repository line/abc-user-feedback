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
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import {
  EventStatusEnum,
  EventTypeEnum,
  WebhookStatusEnum,
} from '@/common/enums';
import { webhookFixture } from '@/test-utils/fixtures';
import { getRandomEnumValue, TestConfig } from '@/test-utils/util-functions';
import { WebhookServiceProviders } from '../../../../test-utils/providers/webhook.service.provider';
import { ChannelEntity } from '../../channel/channel/channel.entity';
import type { CreateWebhookDto, UpdateWebhookDto } from './dtos';
import { WebhookAlreadyExistsException } from './exceptions';
import { WebhookEntity } from './webhook.entity';
import { WebhookService } from './webhook.service';

function createCreateWebhookDto(overrides = {}): CreateWebhookDto {
  return {
    projectId: webhookFixture.project.id,
    name: faker.string.sample(),
    url: faker.internet.url(),
    status: WebhookStatusEnum.ACTIVE,
    events: [
      {
        status: EventStatusEnum.ACTIVE,
        type: EventTypeEnum.FEEDBACK_CREATION,
        channelIds: [faker.number.int()],
      },
      {
        status: EventStatusEnum.ACTIVE,
        type: EventTypeEnum.ISSUE_ADDITION,
        channelIds: [faker.number.int()],
      },
      {
        status: EventStatusEnum.ACTIVE,
        type: EventTypeEnum.ISSUE_CREATION,
        channelIds: null,
      },
      {
        status: EventStatusEnum.ACTIVE,
        type: EventTypeEnum.ISSUE_STATUS_CHANGE,
        channelIds: null,
      },
    ],
    ...overrides,
  };
}

function createUpdateWebhookDto(overrides = {}): UpdateWebhookDto {
  return {
    id: webhookFixture.id,
    projectId: webhookFixture.project.id,
    name: faker.string.sample(),
    url: faker.internet.url(),
    status: getRandomEnumValue(WebhookStatusEnum),
    events: [
      {
        status: getRandomEnumValue(EventStatusEnum),
        type: EventTypeEnum.FEEDBACK_CREATION,
        channelIds: [faker.number.int()],
      },
      {
        status: getRandomEnumValue(EventStatusEnum),
        type: EventTypeEnum.ISSUE_ADDITION,
        channelIds: [faker.number.int()],
      },
      {
        status: getRandomEnumValue(EventStatusEnum),
        type: EventTypeEnum.ISSUE_CREATION,
        channelIds: null,
      },
      {
        status: getRandomEnumValue(EventStatusEnum),
        type: EventTypeEnum.ISSUE_STATUS_CHANGE,
        channelIds: null,
      },
    ],
    ...overrides,
  };
}

describe('webhook service', () => {
  let webhookService: WebhookService;
  let webhookRepo: Repository<WebhookEntity>;
  let channelRepo: Repository<ChannelEntity>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: WebhookServiceProviders,
    }).compile();
    webhookService = module.get(WebhookService);

    webhookRepo = module.get(getRepositoryToken(WebhookEntity));
    channelRepo = module.get(getRepositoryToken(ChannelEntity));
  });

  describe('create', () => {
    it('creating a webhook succeeds with valid inputs (all events)', async () => {
      const dto: CreateWebhookDto = createCreateWebhookDto();
      jest.spyOn(webhookRepo, 'findOne').mockResolvedValue(null);

      const webhook = await webhookService.create(dto);

      expect(webhook.project.id).toBe(dto.projectId);
      expect(webhook.name).toBe(dto.name);
      expect(webhook.url).toBe(dto.url);
      expect(webhook.status).toBe(dto.status);
      expect(webhook.events.length).toBe(dto.events.length);
      for (let i = 0; i < webhook.events.length; i++) {
        expect(webhook.events[i].status).toBe(dto.events[i].status);
        expect(webhook.events[i].type).toBe(dto.events[i].type);
        if (dto.events[i].channelIds) {
          expect(webhook.events[i].channels[0].id).toBe(
            dto.events[i].channelIds[0],
          );
        }
      }
    });
    it('creating a webhook succeeds with valid inputs (multiple channels)', async () => {
      const dto: CreateWebhookDto = createCreateWebhookDto({
        events: [
          {
            status: EventStatusEnum.ACTIVE,
            type: EventTypeEnum.FEEDBACK_CREATION,
            channelIds: [
              faker.number.int(),
              faker.number.int(),
              faker.number.int(),
              faker.number.int(),
            ],
          },
        ],
      });
      jest.spyOn(webhookRepo, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(channelRepo, 'findBy')
        .mockResolvedValue(
          dto.events[0].channelIds.map((id) => ({ id })) as ChannelEntity[],
        );

      const webhook = await webhookService.create(dto);

      expect(webhook.project.id).toBe(dto.projectId);
      expect(webhook.name).toBe(dto.name);
      expect(webhook.url).toBe(dto.url);
      expect(webhook.status).toBe(dto.status);
      expect(webhook.events.length).toBe(dto.events.length);
      expect(webhook.events[0].channels.length).toBe(
        dto.events[0].channelIds.length,
      );
      for (let i = 0; i < webhook.events[0].channels.length; i++) {
        expect(webhook.events[0].channels[i].id).toBe(
          dto.events[0].channelIds[i],
        );
      }
    });
    it('creating a webhook fails with a duplicate name', async () => {
      const dto: CreateWebhookDto = createCreateWebhookDto({
        name: webhookFixture.name,
      });

      await expect(webhookService.create(dto)).rejects.toThrow(
        new WebhookAlreadyExistsException(),
      );
    });
    it('creating a webhook fails with a duplicate url', async () => {
      const dto: CreateWebhookDto = createCreateWebhookDto({
        url: webhookFixture.url,
      });

      await expect(webhookService.create(dto)).rejects.toThrow(
        new WebhookAlreadyExistsException(),
      );
    });
    describe('creating a webhook fails with invalid events', () => {
      it('EventTypeEnum.FEEDBACK_CREATION', async () => {
        const dto = createCreateWebhookDto({
          events: [
            {
              status: EventStatusEnum.ACTIVE,
              type: EventTypeEnum.FEEDBACK_CREATION,
              channelIds: null,
            },
          ],
        });
        jest.spyOn(webhookRepo, 'findOne').mockResolvedValue(null);

        await expect(webhookService.create(dto)).rejects.toThrow(
          new BadRequestException('invalid webhook event and channels'),
        );
      });
      it('EventTypeEnum.ISSUE_ADDITION', async () => {
        const dto = createCreateWebhookDto({
          events: [
            {
              status: EventStatusEnum.ACTIVE,
              type: EventTypeEnum.ISSUE_ADDITION,
              channelIds: null,
            },
          ],
        });
        jest.spyOn(webhookRepo, 'findOne').mockResolvedValue(null);

        await expect(webhookService.create(dto)).rejects.toThrow(
          new BadRequestException('invalid webhook event and channels'),
        );
      });
      it('EventTypeEnum.ISSUE_CREATION', async () => {
        const dto = createCreateWebhookDto({
          events: [
            {
              status: EventStatusEnum.ACTIVE,
              type: EventTypeEnum.ISSUE_CREATION,
              channelIds: [faker.number.int()],
            },
          ],
        });
        jest.spyOn(webhookRepo, 'findOne').mockResolvedValue(null);

        await expect(webhookService.create(dto)).rejects.toThrow(
          new BadRequestException('invalid webhook event and channels'),
        );
      });
      it('EventTypeEnum.ISSUE_STATUS_CHANGE', async () => {
        const dto = createCreateWebhookDto({
          events: [
            {
              status: EventStatusEnum.ACTIVE,
              type: EventTypeEnum.ISSUE_STATUS_CHANGE,
              channelIds: [faker.number.int()],
            },
          ],
        });
        jest.spyOn(webhookRepo, 'findOne').mockResolvedValue(null);

        await expect(webhookService.create(dto)).rejects.toThrow(
          new BadRequestException('invalid webhook event and channels'),
        );
      });
    });
  });

  describe('update', () => {
    it('updating a webhook succeeds with valid inputs', async () => {
      const dto: UpdateWebhookDto = createUpdateWebhookDto();
      jest.spyOn(webhookRepo, 'findOne').mockResolvedValueOnce(webhookFixture);
      jest.spyOn(webhookRepo, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(webhookRepo, 'findOne').mockResolvedValueOnce(null);

      const webhook = await webhookService.update(dto);

      expect(webhook.id).toBe(dto.id);
      expect(webhook.project.id).toBe(dto.projectId);
      expect(webhook.name).toBe(dto.name);
      expect(webhook.url).toBe(dto.url);
      expect(webhook.status).toBe(dto.status);
      expect(webhook.events.length).toBe(dto.events.length);
      for (let i = 0; i < webhook.events.length; i++) {
        expect(webhook.events[i].status).toBe(dto.events[i].status);
        expect(webhook.events[i].type).toBe(dto.events[i].type);
        if (dto.events[i].channelIds) {
          expect(webhook.events[i].channels[0].id).toBe(
            dto.events[i].channelIds[0],
          );
        }
      }
    });
    it('updating a webhook fails with duplicate name', async () => {
      const dto: UpdateWebhookDto = createUpdateWebhookDto();
      jest.spyOn(webhookRepo, 'findOne').mockResolvedValueOnce(webhookFixture);

      await expect(webhookService.update(dto)).rejects.toThrow(
        new WebhookAlreadyExistsException(),
      );
    });
    describe('updating a webhook fails with invalid events', () => {
      it('EventTypeEnum.FEEDBACK_CREATION', async () => {
        const dto = createUpdateWebhookDto({
          events: [
            {
              status: EventStatusEnum.ACTIVE,
              type: EventTypeEnum.FEEDBACK_CREATION,
              channelIds: null,
            },
          ],
        });
        jest
          .spyOn(webhookRepo, 'findOne')
          .mockResolvedValueOnce(webhookFixture);
        jest.spyOn(webhookRepo, 'findOne').mockResolvedValueOnce(null);
        jest.spyOn(webhookRepo, 'findOne').mockResolvedValueOnce(null);

        await expect(webhookService.update(dto)).rejects.toThrow(
          new BadRequestException('invalid webhook event and channels'),
        );
      });
      it('EventTypeEnum.ISSUE_ADDITION', async () => {
        const dto = createUpdateWebhookDto({
          events: [
            {
              status: EventStatusEnum.ACTIVE,
              type: EventTypeEnum.ISSUE_ADDITION,
              channelIds: null,
            },
          ],
        });
        jest
          .spyOn(webhookRepo, 'findOne')
          .mockResolvedValueOnce(webhookFixture);
        jest.spyOn(webhookRepo, 'findOne').mockResolvedValueOnce(null);
        jest.spyOn(webhookRepo, 'findOne').mockResolvedValueOnce(null);

        await expect(webhookService.update(dto)).rejects.toThrow(
          new BadRequestException('invalid webhook event and channels'),
        );
      });
      it('EventTypeEnum.ISSUE_CREATION', async () => {
        const dto = createUpdateWebhookDto({
          events: [
            {
              status: EventStatusEnum.ACTIVE,
              type: EventTypeEnum.ISSUE_CREATION,
              channelIds: [faker.number.int()],
            },
          ],
        });
        jest
          .spyOn(webhookRepo, 'findOne')
          .mockResolvedValueOnce(webhookFixture);
        jest.spyOn(webhookRepo, 'findOne').mockResolvedValueOnce(null);
        jest.spyOn(webhookRepo, 'findOne').mockResolvedValueOnce(null);

        await expect(webhookService.update(dto)).rejects.toThrow(
          new BadRequestException('invalid webhook event and channels'),
        );
      });
      it('EventTypeEnum.ISSUE_STATUS_CHANGE', async () => {
        const dto = createUpdateWebhookDto({
          events: [
            {
              status: EventStatusEnum.ACTIVE,
              type: EventTypeEnum.ISSUE_STATUS_CHANGE,
              channelIds: [faker.number.int()],
            },
          ],
        });
        jest
          .spyOn(webhookRepo, 'findOne')
          .mockResolvedValueOnce(webhookFixture);
        jest.spyOn(webhookRepo, 'findOne').mockResolvedValueOnce(null);
        jest.spyOn(webhookRepo, 'findOne').mockResolvedValueOnce(null);

        await expect(webhookService.update(dto)).rejects.toThrow(
          new BadRequestException('invalid webhook event and channels'),
        );
      });
    });
  });
});
