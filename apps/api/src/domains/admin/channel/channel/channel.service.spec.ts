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

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { channelFixture, createFieldDto } from '@/test-utils/fixtures';
import { TestConfig } from '@/test-utils/util-functions';
import { ChannelServiceProviders } from '../../../../test-utils/providers/channel.service.providers';
import { FieldEntity } from '../field/field.entity';
import { ChannelEntity } from './channel.entity';
import { ChannelService } from './channel.service';
import {
  CreateChannelDto,
  FindAllChannelsByProjectIdDto,
  FindByChannelIdDto,
  FindOneByNameAndProjectIdDto,
  UpdateChannelDto,
  UpdateChannelFieldsDto,
} from './dtos';
import {
  ChannelAlreadyExistsException,
  ChannelInvalidNameException,
  ChannelNotFoundException,
} from './exceptions';

describe('ChannelService', () => {
  let channelService: ChannelService;
  let channelRepo: Repository<ChannelEntity>;
  let fieldRepo: Repository<FieldEntity>;
  let channelServiceAny: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: ChannelServiceProviders,
    }).compile();

    channelService = module.get<ChannelService>(ChannelService);
    channelRepo = module.get(getRepositoryToken(ChannelEntity));
    fieldRepo = module.get(getRepositoryToken(FieldEntity));
    channelServiceAny = channelService as any;
  });

  describe('create', () => {
    it('creating a channel succeeds with valid inputs', async () => {
      const fieldCount = faker.number.int({ min: 1, max: 10 });
      const dto = new CreateChannelDto();
      dto.name = channelFixture.name;
      dto.description = channelFixture.description;
      dto.projectId = channelFixture.project.id;
      dto.feedbackSearchMaxDays = channelFixture.feedbackSearchMaxDays;
      dto.fields = Array.from({ length: fieldCount }).map(createFieldDto);
      jest.spyOn(channelRepo, 'findOneBy').mockResolvedValue(null);
      jest
        .spyOn(fieldRepo, 'save')
        .mockResolvedValue({ id: faker.number.int() } as FieldEntity);

      const channel = await channelService.create(dto);

      expect(channel.id).toBeDefined();
    });

    it('creating a channel fails with a duplicate name', async () => {
      const fieldCount = faker.number.int({ min: 1, max: 10 });
      const dto = new CreateChannelDto();
      dto.name = faker.string.sample();
      dto.description = faker.string.sample();
      dto.projectId = faker.number.int();
      dto.feedbackSearchMaxDays = faker.number.int();
      dto.fields = Array.from({ length: fieldCount }).map(createFieldDto);

      await expect(channelService.create(dto)).rejects.toThrow(
        ChannelAlreadyExistsException,
      );
    });

    it('creating a channel succeeds with empty fields array', async () => {
      const dto = new CreateChannelDto();
      dto.name = faker.string.sample();
      dto.description = faker.string.sample();
      dto.projectId = channelFixture.project.id;
      dto.feedbackSearchMaxDays = faker.number.int();
      dto.fields = [];
      jest.spyOn(channelRepo, 'findOneBy').mockResolvedValue(null);

      const channel = await channelService.create(dto);

      expect(channel.id).toBeDefined();
    });

    it('creating a channel fails with invalid project id', async () => {
      const dto = new CreateChannelDto();
      dto.name = faker.string.sample();
      dto.description = faker.string.sample();
      dto.projectId = faker.number.int();
      dto.feedbackSearchMaxDays = faker.number.int();
      dto.fields = [];

      // Mock projectService.findById to throw error
      jest
        .spyOn(channelServiceAny.projectService, 'findById')
        .mockRejectedValue(new Error('Project not found'));

      await expect(channelService.create(dto)).rejects.toThrow();
    });
  });

  describe('findAllByProjectId', () => {
    it('finding all channels by project id succeeds with valid project id', async () => {
      const dto = new FindAllChannelsByProjectIdDto();
      dto.projectId = channelFixture.project.id;
      dto.options = { limit: 10, page: 1 };
      dto.searchText = faker.string.sample();

      const mockChannels = {
        items: [channelFixture],
        meta: {
          itemCount: 1,
          totalItems: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      };

      jest
        .spyOn(channelServiceAny.channelMySQLService, 'findAllByProjectId')
        .mockResolvedValue(mockChannels);

      const result = await channelService.findAllByProjectId(dto);

      expect(result).toEqual(mockChannels);
      expect(
        channelServiceAny.channelMySQLService.findAllByProjectId,
      ).toHaveBeenCalledWith(dto);
    });

    it('finding all channels by project id returns empty result', async () => {
      const dto = new FindAllChannelsByProjectIdDto();
      dto.projectId = faker.number.int();
      dto.options = { limit: 10, page: 1 };

      const mockChannels = {
        items: [],
        meta: {
          itemCount: 0,
          totalItems: 0,
          itemsPerPage: 10,
          totalPages: 0,
          currentPage: 1,
        },
      };

      jest
        .spyOn(channelServiceAny.channelMySQLService, 'findAllByProjectId')
        .mockResolvedValue(mockChannels);

      const result = await channelService.findAllByProjectId(dto);

      expect(result.items).toHaveLength(0);
      expect(result.meta.totalItems).toBe(0);
    });

    it('finding all channels by project id succeeds without search text', async () => {
      const dto = new FindAllChannelsByProjectIdDto();
      dto.projectId = channelFixture.project.id;
      dto.options = { limit: 10, page: 1 };

      const mockChannels = {
        items: [channelFixture],
        meta: {
          itemCount: 1,
          totalItems: 1,
          itemsPerPage: 10,
          totalPages: 1,
          currentPage: 1,
        },
      };

      jest
        .spyOn(channelServiceAny.channelMySQLService, 'findAllByProjectId')
        .mockResolvedValue(mockChannels);

      const result = await channelService.findAllByProjectId(dto);

      expect(result).toEqual(mockChannels);
    });
  });

  describe('findById', () => {
    it('finding by an id succeeds with an existent id', async () => {
      const dto = new FindByChannelIdDto();
      dto.channelId = channelFixture.id;

      const result = await channelService.findById(dto);

      expect(result).toMatchObject(expect.objectContaining(channelFixture));
    });
    it('finding by an id fails with a nonexistent id', async () => {
      const dto = new FindByChannelIdDto();
      dto.channelId = faker.number.int();
      jest.spyOn(channelRepo, 'findOne').mockResolvedValue(null);

      await expect(channelService.findById(dto)).rejects.toThrow(
        ChannelNotFoundException,
      );
    });
  });

  describe('checkName', () => {
    it('checking name returns true when channel exists', async () => {
      const dto = new FindOneByNameAndProjectIdDto();
      dto.name = channelFixture.name;
      dto.projectId = channelFixture.project.id;

      jest
        .spyOn(channelServiceAny.channelMySQLService, 'findOneBy')
        .mockResolvedValue(channelFixture);

      const result = await channelService.checkName(dto);

      expect(result).toBe(true);
      expect(
        channelServiceAny.channelMySQLService.findOneBy,
      ).toHaveBeenCalledWith(dto);
    });

    it('checking name returns false when channel does not exist', async () => {
      const dto = new FindOneByNameAndProjectIdDto();
      dto.name = faker.string.sample();
      dto.projectId = faker.number.int();

      jest
        .spyOn(channelServiceAny.channelMySQLService, 'findOneBy')
        .mockResolvedValue(null);

      const result = await channelService.checkName(dto);

      expect(result).toBe(false);
      expect(
        channelServiceAny.channelMySQLService.findOneBy,
      ).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('updating succeeds with valid inputs', async () => {
      const channelId = channelFixture.id;
      const dto = new UpdateChannelDto();
      dto.name = faker.string.sample();
      dto.description = faker.string.sample();
      dto.feedbackSearchMaxDays = faker.number.int();
      jest.spyOn(channelRepo, 'findOne').mockResolvedValueOnce(channelFixture);
      jest.spyOn(channelRepo, 'findOne').mockResolvedValueOnce(null);

      const channel = await channelService.updateInfo(channelId, dto);

      expect(channel.name).toEqual(dto.name);
      expect(channel.description).toEqual(dto.description);
    });
    it('updating fails with a duplicate channel name', async () => {
      const channelId = channelFixture.id;
      const dto = new UpdateChannelDto();
      dto.name = channelFixture.name;
      dto.description = faker.string.sample();
      dto.feedbackSearchMaxDays = faker.number.int();

      await expect(channelService.updateInfo(channelId, dto)).rejects.toThrow(
        ChannelInvalidNameException,
      );
    });
  });

  describe('updateFields', () => {
    it('updating fields succeeds with valid inputs', async () => {
      const channelId = channelFixture.id;
      const dto = new UpdateChannelFieldsDto();
      dto.fields = Array.from({ length: 3 }).map(createFieldDto);

      jest
        .spyOn(channelServiceAny.fieldService, 'replaceMany')
        .mockResolvedValue(undefined);

      await channelService.updateFields(channelId, dto);

      expect(channelServiceAny.fieldService.replaceMany).toHaveBeenCalledWith({
        channelId,
        fields: dto.fields,
      });
    });

    it('updating fields succeeds with empty fields array', async () => {
      const channelId = channelFixture.id;
      const dto = new UpdateChannelFieldsDto();
      dto.fields = [];

      jest
        .spyOn(channelServiceAny.fieldService, 'replaceMany')
        .mockResolvedValue(undefined);

      await channelService.updateFields(channelId, dto);

      expect(channelServiceAny.fieldService.replaceMany).toHaveBeenCalledWith({
        channelId,
        fields: [],
      });
    });

    it('updating fields fails when field service throws error', async () => {
      const channelId = channelFixture.id;
      const dto = new UpdateChannelFieldsDto();
      dto.fields = Array.from({ length: 3 }).map(createFieldDto);

      jest
        .spyOn(channelServiceAny.fieldService, 'replaceMany')
        .mockRejectedValue(new Error('Field service error'));

      await expect(
        channelService.updateFields(channelId, dto),
      ).rejects.toThrow();
    });
  });

  describe('deleteById', () => {
    it('deleting by an id succeeds with a valid id', async () => {
      const channelId = faker.number.int();
      const channel = new ChannelEntity();
      channel.id = channelId;

      jest
        .spyOn(channelServiceAny.channelMySQLService, 'delete')
        .mockResolvedValue(channel);

      const deletedChannel = await channelService.deleteById(channelId);

      expect(deletedChannel.id).toEqual(channel.id);
      expect(channelServiceAny.channelMySQLService.delete).toHaveBeenCalledWith(
        channelId,
      );
    });

    it('deleting by an id succeeds with OpenSearch enabled', async () => {
      const channelId = faker.number.int();
      const channel = new ChannelEntity();
      channel.id = channelId;

      // Mock config to enable OpenSearch
      jest.spyOn(channelServiceAny.configService, 'get').mockReturnValue(true);
      jest
        .spyOn(channelServiceAny.osRepository, 'deleteIndex')
        .mockResolvedValue(undefined);
      jest
        .spyOn(channelServiceAny.channelMySQLService, 'delete')
        .mockResolvedValue(channel);

      const deletedChannel = await channelService.deleteById(channelId);

      expect(deletedChannel.id).toEqual(channel.id);
      expect(channelServiceAny.osRepository.deleteIndex).toHaveBeenCalledWith(
        channelId.toString(),
      );
      expect(channelServiceAny.channelMySQLService.delete).toHaveBeenCalledWith(
        channelId,
      );
    });

    it('deleting by an id succeeds with OpenSearch disabled', async () => {
      const channelId = faker.number.int();
      const channel = new ChannelEntity();
      channel.id = channelId;

      // Mock config to disable OpenSearch
      jest.spyOn(channelServiceAny.configService, 'get').mockReturnValue(false);
      jest
        .spyOn(channelServiceAny.channelMySQLService, 'delete')
        .mockResolvedValue(channel);

      const deletedChannel = await channelService.deleteById(channelId);

      expect(deletedChannel.id).toEqual(channel.id);
      expect(channelServiceAny.osRepository.deleteIndex).not.toHaveBeenCalled();
      expect(channelServiceAny.channelMySQLService.delete).toHaveBeenCalledWith(
        channelId,
      );
    });

    it('deleting by an id fails when MySQL service throws error', async () => {
      const channelId = faker.number.int();

      jest
        .spyOn(channelServiceAny.channelMySQLService, 'delete')
        .mockRejectedValue(new Error('MySQL service error'));

      await expect(channelService.deleteById(channelId)).rejects.toThrow();
    });
  });
});
