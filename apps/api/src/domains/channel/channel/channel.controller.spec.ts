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
import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { getMockProvider, MockDataSource } from '@/utils/test-utils';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import {
  CreateChannelRequestDto,
  FindChannelsByProjectIdRequestDto,
} from './dtos/requests';

const MockChannelService = {
  create: jest.fn(),
  findAllByProjectId: jest.fn(),
  deleteById: jest.fn(),
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
    it('should return an array of users', async () => {
      jest.spyOn(MockChannelService, 'create');

      const projectId = faker.datatype.number();
      const dto = new CreateChannelRequestDto();
      dto.name = faker.datatype.string();
      dto.description = faker.datatype.string();
      dto.fields = [];

      await channelController.create(projectId, dto);
      expect(MockChannelService.create).toBeCalledTimes(1);
    });
  });
  describe('findAllByProjectId', () => {
    it('should return an array of users', async () => {
      jest.spyOn(MockChannelService, 'findAllByProjectId');

      const projectId = faker.datatype.number();
      const dto = new FindChannelsByProjectIdRequestDto();
      dto.limit = faker.datatype.number();
      dto.page = faker.datatype.number();

      await channelController.findAllByProjectId(projectId, dto);
      expect(MockChannelService.findAllByProjectId).toBeCalledTimes(1);
    });
  });
  describe('delete', () => {
    it('', async () => {
      jest.spyOn(MockChannelService, 'deleteById');
      const channelId = faker.datatype.number();

      await channelController.delete(channelId);
      expect(MockChannelService.deleteById).toBeCalledTimes(1);
    });
  });
});
