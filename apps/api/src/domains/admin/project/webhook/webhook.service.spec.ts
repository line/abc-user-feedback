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
    token: faker.string.sample(),
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
        channelIds: [],
      },
      {
        status: EventStatusEnum.ACTIVE,
        type: EventTypeEnum.ISSUE_STATUS_CHANGE,
        channelIds: [],
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
    token: faker.string.sample(),
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
        channelIds: [],
      },
      {
        status: getRandomEnumValue(EventStatusEnum),
        type: EventTypeEnum.ISSUE_STATUS_CHANGE,
        channelIds: [],
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
      expect(webhook.token).toBe(dto.token);
      expect(webhook.status).toBe(dto.status);
      expect(webhook.events.length).toBe(dto.events.length);
      for (let i = 0; i < webhook.events.length; i++) {
        expect(webhook.events[i].status).toBe(dto.events[i].status);
        expect(webhook.events[i].type).toBe(dto.events[i].type);
        if (dto.events[i].channelIds.length !== 0) {
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
      expect(webhook.token).toBe(dto.token);
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
              channelIds: [],
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
              channelIds: [],
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
      expect(webhook.token).toBe(dto.token);
      expect(webhook.status).toBe(dto.status);
      expect(webhook.events.length).toBe(dto.events.length);
      for (let i = 0; i < webhook.events.length; i++) {
        expect(webhook.events[i].status).toBe(dto.events[i].status);
        expect(webhook.events[i].type).toBe(dto.events[i].type);
        if (dto.events[i].channelIds.length !== 0) {
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
              channelIds: [],
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
              channelIds: [],
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

  describe('findById', () => {
    it('should return webhook with events and channels when webhook exists', async () => {
      const webhookId = webhookFixture.id;
      jest.spyOn(webhookRepo, 'find').mockResolvedValue([webhookFixture]);

      const result = await webhookService.findById(webhookId);

      expect(result).toEqual([webhookFixture]);
      expect(webhookRepo.find).toHaveBeenCalledWith({
        where: { id: webhookId },
        relations: { events: { channels: true } },
      });
    });

    it('should return empty array when webhook does not exist', async () => {
      const webhookId = faker.number.int();
      jest.spyOn(webhookRepo, 'find').mockResolvedValue([]);

      const result = await webhookService.findById(webhookId);

      expect(result).toEqual([]);
      expect(webhookRepo.find).toHaveBeenCalledWith({
        where: { id: webhookId },
        relations: { events: { channels: true } },
      });
    });
  });

  describe('findByProjectId', () => {
    it('should return webhooks for given project when webhooks exist', async () => {
      const projectId = webhookFixture.project.id;
      const webhooks = [webhookFixture];
      jest.spyOn(webhookRepo, 'find').mockResolvedValue(webhooks);

      const result = await webhookService.findByProjectId(projectId);

      expect(result).toEqual(webhooks);
      expect(webhookRepo.find).toHaveBeenCalledWith({
        where: { project: { id: projectId } },
        relations: { events: { channels: true } },
      });
    });

    it('should return empty array when no webhooks exist for project', async () => {
      const projectId = faker.number.int();
      jest.spyOn(webhookRepo, 'find').mockResolvedValue([]);

      const result = await webhookService.findByProjectId(projectId);

      expect(result).toEqual([]);
      expect(webhookRepo.find).toHaveBeenCalledWith({
        where: { project: { id: projectId } },
        relations: { events: { channels: true } },
      });
    });
  });

  describe('delete', () => {
    it('should delete webhook when webhook exists', async () => {
      const webhookId = webhookFixture.id;
      jest.spyOn(webhookRepo, 'findOne').mockResolvedValue(webhookFixture);
      jest.spyOn(webhookRepo, 'remove').mockResolvedValue(webhookFixture);

      await webhookService.delete(webhookId);

      expect(webhookRepo.findOne).toHaveBeenCalledWith({
        where: { id: webhookId },
      });
      expect(webhookRepo.remove).toHaveBeenCalledWith(webhookFixture);
    });

    it('should delete webhook even when webhook does not exist', async () => {
      const webhookId = faker.number.int();
      const emptyWebhook = new WebhookEntity();
      jest.spyOn(webhookRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(webhookRepo, 'remove').mockResolvedValue(emptyWebhook);

      await webhookService.delete(webhookId);

      expect(webhookRepo.findOne).toHaveBeenCalledWith({
        where: { id: webhookId },
      });
      expect(webhookRepo.remove).toHaveBeenCalledWith(emptyWebhook);
    });
  });

  describe('validateEvent', () => {
    describe('events requiring channel IDs', () => {
      it('should return true when FEEDBACK_CREATION has valid channel IDs', async () => {
        const channelIds = [faker.number.int(), faker.number.int()];
        jest
          .spyOn(channelRepo, 'findBy')
          .mockResolvedValue(
            channelIds.map((id) => ({ id })) as ChannelEntity[],
          );

        const result = await webhookService.validateEvent({
          status: EventStatusEnum.ACTIVE,
          type: EventTypeEnum.FEEDBACK_CREATION,
          channelIds,
        });

        expect(result).toBe(true);
        expect(channelRepo.findBy).toHaveBeenCalledWith({
          id: expect.objectContaining({ _type: 'in', _value: channelIds }),
        });
      });

      it('should return false when FEEDBACK_CREATION has invalid channel IDs', async () => {
        const channelIds = [faker.number.int(), faker.number.int()];
        jest
          .spyOn(channelRepo, 'findBy')
          .mockResolvedValue([{ id: channelIds[0] }] as ChannelEntity[]);

        const result = await webhookService.validateEvent({
          status: EventStatusEnum.ACTIVE,
          type: EventTypeEnum.FEEDBACK_CREATION,
          channelIds,
        });

        expect(result).toBe(false);
      });

      it('should return true when ISSUE_ADDITION has valid channel IDs', async () => {
        const channelIds = [faker.number.int()];
        jest
          .spyOn(channelRepo, 'findBy')
          .mockResolvedValue(
            channelIds.map((id) => ({ id })) as ChannelEntity[],
          );

        const result = await webhookService.validateEvent({
          status: EventStatusEnum.ACTIVE,
          type: EventTypeEnum.ISSUE_ADDITION,
          channelIds,
        });

        expect(result).toBe(true);
      });

      it('should return false when ISSUE_ADDITION has invalid channel IDs', async () => {
        const channelIds = [faker.number.int()];
        jest.spyOn(channelRepo, 'findBy').mockResolvedValue([]);

        const result = await webhookService.validateEvent({
          status: EventStatusEnum.ACTIVE,
          type: EventTypeEnum.ISSUE_ADDITION,
          channelIds,
        });

        expect(result).toBe(false);
      });
    });

    describe('events excluding channel IDs', () => {
      it('should return true when ISSUE_CREATION has empty channel IDs', async () => {
        const result = await webhookService.validateEvent({
          status: EventStatusEnum.ACTIVE,
          type: EventTypeEnum.ISSUE_CREATION,
          channelIds: [],
        });

        expect(result).toBe(true);
      });

      it('should return false when ISSUE_CREATION has non-empty channel IDs', async () => {
        const result = await webhookService.validateEvent({
          status: EventStatusEnum.ACTIVE,
          type: EventTypeEnum.ISSUE_CREATION,
          channelIds: [faker.number.int()],
        });

        expect(result).toBe(false);
      });

      it('should return true when ISSUE_STATUS_CHANGE has empty channel IDs', async () => {
        const result = await webhookService.validateEvent({
          status: EventStatusEnum.ACTIVE,
          type: EventTypeEnum.ISSUE_STATUS_CHANGE,
          channelIds: [],
        });

        expect(result).toBe(true);
      });

      it('should return false when ISSUE_STATUS_CHANGE has non-empty channel IDs', async () => {
        const result = await webhookService.validateEvent({
          status: EventStatusEnum.ACTIVE,
          type: EventTypeEnum.ISSUE_STATUS_CHANGE,
          channelIds: [faker.number.int()],
        });

        expect(result).toBe(false);
      });
    });

    it('should return false for unknown event type', async () => {
      const result = await webhookService.validateEvent({
        status: EventStatusEnum.ACTIVE,
        type: 'UNKNOWN_EVENT_TYPE' as EventTypeEnum,
        channelIds: [],
      });

      expect(result).toBe(false);
    });
  });

  describe('create - additional edge cases', () => {
    it('should handle empty events array', async () => {
      const dto: CreateWebhookDto = createCreateWebhookDto({
        events: [],
      });
      jest.spyOn(webhookRepo, 'findOne').mockResolvedValue(null);

      const webhook = await webhookService.create(dto);

      expect(webhook.events).toEqual([]);
    });

    it('should handle null token', async () => {
      const dto: CreateWebhookDto = createCreateWebhookDto({
        token: null,
      });
      jest.spyOn(webhookRepo, 'findOne').mockResolvedValue(null);

      const webhook = await webhookService.create(dto);

      expect(webhook.token).toBeNull();
    });

    it('should handle undefined token', async () => {
      const dto: CreateWebhookDto = {
        projectId: webhookFixture.project.id,
        name: faker.string.sample(),
        url: faker.internet.url(),
        token: undefined as any, // TypeScript 타입 체크를 우회하여 undefined 전달
        status: WebhookStatusEnum.ACTIVE,
        events: [
          {
            status: EventStatusEnum.ACTIVE,
            type: EventTypeEnum.FEEDBACK_CREATION,
            channelIds: [faker.number.int()],
          },
        ],
      };
      jest.spyOn(webhookRepo, 'findOne').mockResolvedValue(null);

      const webhook = await webhookService.create(dto);

      // undefined가 실제로 어떻게 처리되는지 확인
      expect(webhook.token).toBeDefined();
      expect(typeof webhook.token).toBe('string');
    });
  });

  describe('update - additional edge cases', () => {
    it('should handle updating non-existent webhook', async () => {
      const dto: UpdateWebhookDto = createUpdateWebhookDto({
        id: faker.number.int(),
      });
      jest.spyOn(webhookRepo, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(webhookRepo, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(webhookRepo, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(webhookRepo, 'save').mockResolvedValue(webhookFixture);

      const webhook = await webhookService.update(dto);

      expect(webhook).toBeDefined();
      expect(webhookRepo.save).toHaveBeenCalled();
    });

    it('should handle updating webhook with same name but different ID', async () => {
      const dto: UpdateWebhookDto = createUpdateWebhookDto({
        name: webhookFixture.name,
        id: faker.number.int(),
      });
      jest.spyOn(webhookRepo, 'findOne').mockResolvedValueOnce(webhookFixture);
      jest.spyOn(webhookRepo, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(webhookRepo, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(webhookRepo, 'save').mockResolvedValue(webhookFixture);

      const webhook = await webhookService.update(dto);

      expect(webhook).toBeDefined();
    });

    it('should handle updating webhook with null token', async () => {
      const dto: UpdateWebhookDto = createUpdateWebhookDto({
        token: null,
      });
      jest.spyOn(webhookRepo, 'findOne').mockResolvedValueOnce(webhookFixture);
      jest.spyOn(webhookRepo, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(webhookRepo, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(webhookRepo, 'save').mockResolvedValue(webhookFixture);

      const webhook = await webhookService.update(dto);

      expect(webhook.token).toBeNull();
    });
  });
});
