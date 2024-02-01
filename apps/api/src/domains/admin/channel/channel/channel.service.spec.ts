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
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { createFieldDto } from '@/test-utils/fixtures';
import { TestConfig } from '@/test-utils/util-functions';
import { ChannelServiceProviders } from '../../../../test-utils/providers/channel.service.providers';
import { ProjectEntity } from '../../project/project/project.entity';
import { FieldEntity } from '../field/field.entity';
import { ChannelEntity } from './channel.entity';
import { ChannelMySQLService } from './channel.mysql.service';
import { ChannelService } from './channel.service';
import { CreateChannelDto, FindByChannelIdDto, UpdateChannelDto } from './dtos';
import {
  ChannelAlreadyExistsException,
  ChannelInvalidNameException,
  ChannelNotFoundException,
} from './exceptions';

const channelFixture = new ChannelEntity();
channelFixture.id = faker.number.int();
channelFixture.name = faker.string.sample();
channelFixture.description = faker.string.sample();
channelFixture.project = new ProjectEntity();
channelFixture.project.id = faker.number.int();
channelFixture.fields = [];

describe('ChannelService', () => {
  let channelService: ChannelService;
  let projectRepo: Repository<ProjectEntity>;
  let channelRepo: Repository<ChannelEntity>;
  let fieldRepo: Repository<FieldEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: ChannelServiceProviders,
    }).compile();

    channelService = module.get<ChannelService>(ChannelService);
    projectRepo = module.get(getRepositoryToken(ProjectEntity));
    channelRepo = module.get(getRepositoryToken(ChannelEntity));
    fieldRepo = module.get(getRepositoryToken(FieldEntity));
  });

  describe('create', () => {
    it('creating a channel succeeds with valid inputs', async () => {
      const fieldCount = faker.number.int({ min: 1, max: 10 });
      const dto = new CreateChannelDto();
      dto.name = channelFixture.name;
      dto.description = channelFixture.description;
      dto.projectId = channelFixture.project.id;
      dto.fields = Array.from({ length: fieldCount }).map(createFieldDto);
      jest
        .spyOn(projectRepo, 'findOneBy')
        .mockResolvedValue({} as ProjectEntity);
      jest.spyOn(channelRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(channelRepo, 'save').mockResolvedValue(channelFixture);
      jest
        .spyOn(fieldRepo, 'save')
        .mockResolvedValue({ id: faker.number.int() } as FieldEntity);

      const channel = await channelService.create(dto);

      expect(channel.id).toEqual(channelFixture.id);
    });
    it('creating a channel fails with a duplicate name', async () => {
      const fieldCount = faker.number.int({ min: 1, max: 10 });
      const dto = new CreateChannelDto();
      dto.name = faker.string.sample();
      dto.description = faker.string.sample();
      dto.projectId = faker.number.int();
      dto.fields = Array.from({ length: fieldCount }).map(createFieldDto);
      jest
        .spyOn(projectRepo, 'findOneBy')
        .mockResolvedValue({} as ProjectEntity);
      jest
        .spyOn(channelRepo, 'findOneBy')
        .mockResolvedValue({} as ChannelEntity);

      await expect(channelService.create(dto)).rejects.toThrow(
        ChannelAlreadyExistsException,
      );
    });
  });
  describe('findById', () => {
    it('finding by an id succeeds with an existent id', async () => {
      const dto = new FindByChannelIdDto();
      dto.channelId = channelFixture.id;
      jest.spyOn(channelRepo, 'findOne').mockResolvedValue(channelFixture);

      const result = await channelService.findById(dto);

      expect(result).toEqual(channelFixture);
    });
    it('finding by an id fails with a nonexistent id', async () => {
      const dto = new FindByChannelIdDto();
      dto.channelId = faker.number.int();
      jest
        .spyOn(channelRepo, 'findOne')
        .mockResolvedValue(null as ChannelEntity);

      await expect(channelService.findById(dto)).rejects.toThrow(
        ChannelNotFoundException,
      );
    });
  });

  describe('update', () => {
    it('updating succeeds with valid inputs', async () => {
      const channelId = channelFixture.id;
      const dto = new UpdateChannelDto();
      dto.name = faker.string.sample();
      dto.description = faker.string.sample();
      jest
        .spyOn(ChannelMySQLService.prototype, 'findById')
        .mockResolvedValue(channelFixture);
      jest.spyOn(channelRepo, 'findOne').mockResolvedValue(null);

      await channelService.updateInfo(channelId, dto);

      expect(channelRepo.save).toBeCalledTimes(1);
      expect(channelRepo.save).toHaveBeenCalledWith({
        ...channelFixture,
        ...dto,
      });
    });
    it('updating fails with a duplicate channel name', async () => {
      const channelId = channelFixture.id;
      const dto = new UpdateChannelDto();
      dto.name = channelFixture.name;
      dto.description = faker.string.sample();
      jest
        .spyOn(ChannelMySQLService.prototype, 'findById')
        .mockResolvedValue(channelFixture);
      jest.spyOn(channelRepo, 'findOne').mockResolvedValue({
        ...channelFixture,
        id: faker.number.int(),
      } as ChannelEntity);

      await expect(channelService.updateInfo(channelId, dto)).rejects.toThrow(
        ChannelInvalidNameException,
      );
    });
  });

  describe('deleteById', () => {
    it('deleting by an id succeeds with a valid id', async () => {
      const channelId = faker.number.int();
      const channel = new ChannelEntity();
      channel.id = channelId;

      await channelService.deleteById(channelId);

      expect(channelRepo.remove).toBeCalledTimes(1);
      expect(channelRepo.remove).toHaveBeenCalledWith(channel);
    });
  });
});
