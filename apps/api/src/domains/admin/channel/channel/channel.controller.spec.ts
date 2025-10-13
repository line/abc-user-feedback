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
import { DataSource } from 'typeorm';

import { getMockProvider, MockDataSource } from '@/test-utils/util-functions';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import {
  CreateChannelRequestDto,
  FindChannelsByProjectIdRequestDto,
  ImageUploadUrlTestRequestDto,
  UpdateChannelFieldsRequestDto,
  UpdateChannelRequestDto,
} from './dtos/requests';
import {
  CreateChannelResponseDto,
  FindChannelByIdResponseDto,
  FindChannelsByProjectIdResponseDto,
} from './dtos/responses';

const MockChannelService = {
  create: jest.fn(),
  findAllByProjectId: jest.fn(),
  deleteById: jest.fn(),
  checkName: jest.fn(),
  findById: jest.fn(),
  updateInfo: jest.fn(),
  updateFields: jest.fn(),
  isValidImageConfig: jest.fn(),
  createImageDownloadUrl: jest.fn(),
};

describe('ChannelController', () => {
  let channelController: ChannelController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ChannelController],
      providers: [
        getMockProvider(ChannelService, MockChannelService),
        getMockProvider(DataSource, MockDataSource),
      ],
    }).compile();

    channelController = module.get<ChannelController>(ChannelController);
  });

  describe('create', () => {
    it('should create channel successfully', async () => {
      const projectId = faker.number.int();
      const dto = new CreateChannelRequestDto();
      dto.name = faker.string.sample();
      dto.description = faker.string.sample();
      dto.feedbackSearchMaxDays = faker.number.int();
      dto.fields = [];

      const mockChannel = { id: faker.number.int(), name: dto.name };
      MockChannelService.create.mockResolvedValue(mockChannel);

      const result = await channelController.create(projectId, dto);

      expect(MockChannelService.create).toHaveBeenCalledTimes(1);
      expect(MockChannelService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId,
          name: dto.name,
          description: dto.description,
          feedbackSearchMaxDays: dto.feedbackSearchMaxDays,
          fields: dto.fields,
        }),
      );
      expect(result).toBeInstanceOf(CreateChannelResponseDto);
      expect(result.id).toBe(mockChannel.id);
    });

    it('should handle channel creation failure', async () => {
      const projectId = faker.number.int();
      const dto = new CreateChannelRequestDto();
      dto.name = faker.string.sample();
      dto.description = faker.string.sample();
      dto.feedbackSearchMaxDays = faker.number.int();
      dto.fields = [];

      const error = new BadRequestException('Channel creation failed');
      MockChannelService.create.mockRejectedValue(error);

      await expect(channelController.create(projectId, dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(MockChannelService.create).toHaveBeenCalledTimes(1);
    });
  });
  describe('findAllByProjectId', () => {
    it('should return channels by project id successfully', async () => {
      const projectId = faker.number.int();
      const dto = new FindChannelsByProjectIdRequestDto();
      dto.limit = faker.number.int({ min: 1, max: 100 });
      dto.page = faker.number.int({ min: 1, max: 10 });
      dto.searchText = faker.string.sample();

      const mockChannels = {
        items: [
          { id: faker.number.int(), name: faker.string.sample() },
          { id: faker.number.int(), name: faker.string.sample() },
        ],
        meta: {
          itemCount: 2,
          totalItems: 2,
          itemsPerPage: dto.limit,
          totalPages: 1,
          currentPage: dto.page,
        },
      };
      MockChannelService.findAllByProjectId.mockResolvedValue(mockChannels);

      const result = await channelController.findAllByProjectId(projectId, dto);

      expect(MockChannelService.findAllByProjectId).toHaveBeenCalledTimes(1);
      expect(MockChannelService.findAllByProjectId).toHaveBeenCalledWith({
        options: { limit: dto.limit, page: dto.page },
        searchText: dto.searchText,
        projectId,
      });
      expect(result).toBeInstanceOf(FindChannelsByProjectIdResponseDto);
      expect(result.items).toHaveLength(2);
      expect(result.meta.totalItems).toBe(2);
    });

    it('should return empty channels when no data found', async () => {
      const projectId = faker.number.int();
      const dto = new FindChannelsByProjectIdRequestDto();
      dto.limit = faker.number.int({ min: 1, max: 100 });
      dto.page = faker.number.int({ min: 1, max: 10 });
      dto.searchText = 'nonexistent';

      const mockChannels = {
        items: [],
        meta: {
          itemCount: 0,
          totalItems: 0,
          itemsPerPage: dto.limit,
          totalPages: 0,
          currentPage: dto.page,
        },
      };
      MockChannelService.findAllByProjectId.mockResolvedValue(mockChannels);

      const result = await channelController.findAllByProjectId(projectId, dto);

      expect(MockChannelService.findAllByProjectId).toHaveBeenCalledTimes(1);
      expect(result.items).toHaveLength(0);
      expect(result.meta.totalItems).toBe(0);
    });

    it('should handle service error', async () => {
      const projectId = faker.number.int();
      const dto = new FindChannelsByProjectIdRequestDto();
      dto.limit = faker.number.int({ min: 1, max: 100 });
      dto.page = faker.number.int({ min: 1, max: 10 });

      const error = new BadRequestException('Service error');
      MockChannelService.findAllByProjectId.mockRejectedValue(error);

      await expect(
        channelController.findAllByProjectId(projectId, dto),
      ).rejects.toThrow(BadRequestException);
      expect(MockChannelService.findAllByProjectId).toHaveBeenCalledTimes(1);
    });
  });
  describe('delete', () => {
    it('should delete channel successfully', async () => {
      const channelId = faker.number.int();
      MockChannelService.deleteById.mockResolvedValue(undefined);

      await channelController.delete(channelId);

      expect(MockChannelService.deleteById).toHaveBeenCalledTimes(1);
      expect(MockChannelService.deleteById).toHaveBeenCalledWith(channelId);
    });

    it('should handle channel deletion failure', async () => {
      const channelId = faker.number.int();
      const error = new BadRequestException('Channel not found');
      MockChannelService.deleteById.mockRejectedValue(error);

      await expect(channelController.delete(channelId)).rejects.toThrow(
        BadRequestException,
      );
      expect(MockChannelService.deleteById).toHaveBeenCalledTimes(1);
      expect(MockChannelService.deleteById).toHaveBeenCalledWith(channelId);
    });
  });

  describe('checkName', () => {
    it('should check channel name availability successfully', async () => {
      const projectId = faker.number.int();
      const name = faker.string.sample();
      MockChannelService.checkName.mockResolvedValue(true);

      const result = await channelController.checkName(projectId, name);

      expect(MockChannelService.checkName).toHaveBeenCalledTimes(1);
      expect(MockChannelService.checkName).toHaveBeenCalledWith({
        projectId,
        name,
      });
      expect(result).toBe(true);
    });

    it('should return false when name is not available', async () => {
      const projectId = faker.number.int();
      const name = faker.string.sample();
      MockChannelService.checkName.mockResolvedValue(false);

      const result = await channelController.checkName(projectId, name);

      expect(MockChannelService.checkName).toHaveBeenCalledTimes(1);
      expect(result).toBe(false);
    });
  });

  describe('findOne', () => {
    it('should find channel by id successfully', async () => {
      const channelId = faker.number.int();
      const mockChannel = {
        id: channelId,
        name: faker.string.sample(),
        description: faker.string.sample(),
        fields: [],
      };
      MockChannelService.findById.mockResolvedValue(mockChannel);

      const result = await channelController.findOne(channelId);

      expect(MockChannelService.findById).toHaveBeenCalledTimes(1);
      expect(MockChannelService.findById).toHaveBeenCalledWith({ channelId });
      expect(result).toBeInstanceOf(FindChannelByIdResponseDto);
      expect(result.id).toBe(channelId);
    });

    it('should handle channel not found', async () => {
      const channelId = faker.number.int();
      const error = new BadRequestException('Channel not found');
      MockChannelService.findById.mockRejectedValue(error);

      await expect(channelController.findOne(channelId)).rejects.toThrow(
        BadRequestException,
      );
      expect(MockChannelService.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateOne', () => {
    it('should update channel successfully', async () => {
      const channelId = faker.number.int();
      const dto = new UpdateChannelRequestDto();
      dto.name = faker.string.sample();
      dto.description = faker.string.sample();
      MockChannelService.updateInfo.mockResolvedValue(undefined);

      await channelController.updateOne(channelId, dto);

      expect(MockChannelService.updateInfo).toHaveBeenCalledTimes(1);
      expect(MockChannelService.updateInfo).toHaveBeenCalledWith(
        channelId,
        dto,
      );
    });

    it('should handle update failure', async () => {
      const channelId = faker.number.int();
      const dto = new UpdateChannelRequestDto();
      const error = new BadRequestException('Update failed');
      MockChannelService.updateInfo.mockRejectedValue(error);

      await expect(channelController.updateOne(channelId, dto)).rejects.toThrow(
        BadRequestException,
      );
      expect(MockChannelService.updateInfo).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateFields', () => {
    it('should update channel fields successfully', async () => {
      const channelId = faker.number.int();
      const dto = new UpdateChannelFieldsRequestDto();
      dto.fields = [];
      MockChannelService.updateFields.mockResolvedValue(undefined);

      await channelController.updateFields(channelId, dto);

      expect(MockChannelService.updateFields).toHaveBeenCalledTimes(1);
      expect(MockChannelService.updateFields).toHaveBeenCalledWith(
        channelId,
        dto,
      );
    });

    it('should handle fields update failure', async () => {
      const channelId = faker.number.int();
      const dto = new UpdateChannelFieldsRequestDto();
      const error = new BadRequestException('Fields update failed');
      MockChannelService.updateFields.mockRejectedValue(error);

      await expect(
        channelController.updateFields(channelId, dto),
      ).rejects.toThrow(BadRequestException);
      expect(MockChannelService.updateFields).toHaveBeenCalledTimes(1);
    });
  });

  describe('getImageUploadUrlTest', () => {
    it('should test image upload URL successfully', async () => {
      const dto = new ImageUploadUrlTestRequestDto();
      dto.accessKeyId = faker.string.sample();
      dto.secretAccessKey = faker.string.sample();
      dto.endpoint = faker.internet.url();
      dto.region = faker.string.sample();
      dto.bucket = faker.string.sample();
      MockChannelService.isValidImageConfig.mockResolvedValue(true);

      const result = await channelController.getImageUploadUrlTest(dto);

      expect(MockChannelService.isValidImageConfig).toHaveBeenCalledTimes(1);
      expect(MockChannelService.isValidImageConfig).toHaveBeenCalledWith({
        accessKeyId: dto.accessKeyId,
        secretAccessKey: dto.secretAccessKey,
        endpoint: dto.endpoint,
        region: dto.region,
        bucket: dto.bucket,
      });
      expect(result).toEqual({ success: true });
    });

    it('should return false when image config is invalid', async () => {
      const dto = new ImageUploadUrlTestRequestDto();
      MockChannelService.isValidImageConfig.mockResolvedValue(false);

      const result = await channelController.getImageUploadUrlTest(dto);

      expect(result).toEqual({ success: false });
    });
  });

  describe('getImageDownloadUrl', () => {
    it('should get image download URL successfully', async () => {
      const projectId = faker.number.int();
      const channelId = faker.number.int();
      const imageKey = faker.string.sample();
      const mockChannel = {
        id: channelId,
        project: { id: projectId },
        imageConfig: {
          accessKeyId: faker.string.sample(),
          secretAccessKey: faker.string.sample(),
          endpoint: faker.internet.url(),
          region: faker.string.sample(),
          bucket: faker.string.sample(),
        },
      };
      const mockUrl = faker.internet.url();
      MockChannelService.findById.mockResolvedValue(mockChannel);
      MockChannelService.createImageDownloadUrl.mockResolvedValue(mockUrl);

      const result = await channelController.getImageDownloadUrl(
        projectId,
        channelId,
        imageKey,
      );

      expect(MockChannelService.findById).toHaveBeenCalledTimes(1);
      expect(MockChannelService.createImageDownloadUrl).toHaveBeenCalledTimes(
        1,
      );
      expect(result).toBe(mockUrl);
    });

    it('should throw error when imageKey is missing', async () => {
      const projectId = faker.number.int();
      const channelId = faker.number.int();

      await expect(
        channelController.getImageDownloadUrl(projectId, channelId, ''),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error when channel project id mismatch', async () => {
      const projectId = faker.number.int();
      const channelId = faker.number.int();
      const imageKey = faker.string.sample();
      const mockChannel = {
        id: channelId,
        project: { id: faker.number.int() }, // Different project ID
      };
      MockChannelService.findById.mockResolvedValue(mockChannel);

      await expect(
        channelController.getImageDownloadUrl(projectId, channelId, imageKey),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error when channel has no image config', async () => {
      const projectId = faker.number.int();
      const channelId = faker.number.int();
      const imageKey = faker.string.sample();
      const mockChannel = {
        id: channelId,
        project: { id: projectId },
        imageConfig: null,
      };
      MockChannelService.findById.mockResolvedValue(mockChannel);

      await expect(
        channelController.getImageDownloadUrl(projectId, channelId, imageKey),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
