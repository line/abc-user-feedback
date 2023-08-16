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
import { Repository } from 'typeorm';

import { OpensearchRepository } from '@/common/repositories';
import { ProjectServiceProviders } from '@/domains/project/project/project.service.spec';
import { createFieldDto } from '@/utils/test-util-fixture';
import {
  MockOpensearchRepository,
  getMockProvider,
  mockRepository,
} from '@/utils/test-utils';

import { ChannelEntity } from '../../channel/channel/channel.entity';
import { ProjectEntity } from '../../project/project/project.entity';
import { FieldEntity } from '../field/field.entity';
import { FieldServiceProviders } from '../field/field.service.spec';
import { ChannelMySQLService } from './channel.mysql.service';
import { ChannelService } from './channel.service';
import { CreateChannelDto, FindByChannelIdDto, UpdateChannelDto } from './dtos';
import {
  ChannelAlreadyExistsException,
  ChannelInvalidNameException,
  ChannelNotFoundException,
} from './exceptions';

export const ChannelServiceProviders = [
  ChannelService,
  ChannelMySQLService,
  {
    provide: getRepositoryToken(ChannelEntity),
    useValue: mockRepository(),
  },
  getMockProvider(OpensearchRepository, MockOpensearchRepository),
  ...ProjectServiceProviders,
  ...FieldServiceProviders,
];

const channelFixture = new ChannelEntity();
channelFixture.id = faker.datatype.number();
channelFixture.name = faker.datatype.string();
channelFixture.description = faker.datatype.string();
channelFixture.project = new ProjectEntity();
channelFixture.project.id = faker.datatype.number();
channelFixture.fields = [];

describe('ChannelService', () => {
  let channelService: ChannelService;
  let projectRepo: Repository<ProjectEntity>;
  let channelRepo: Repository<ChannelEntity>;
  let fieldRepo: Repository<FieldEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: ChannelServiceProviders,
    }).compile();

    channelService = module.get<ChannelService>(ChannelService);
    projectRepo = module.get(getRepositoryToken(ProjectEntity));
    channelRepo = module.get(getRepositoryToken(ChannelEntity));
    fieldRepo = module.get(getRepositoryToken(FieldEntity));
  });

  describe('create', () => {
    it('creating a channel succeeds with valid inputs', async () => {
      const fieldCount = faker.datatype.number({ min: 1, max: 10 });
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
        .mockResolvedValue({ id: faker.datatype.number() } as FieldEntity);

      const channel = await channelService.create(dto);

      expect(channel.id).toEqual(channelFixture.id);
      expect(channelRepo.save).toBeCalledTimes(1);
      expect(channelRepo.save).toHaveBeenCalledWith(
        CreateChannelDto.toChannelEntity(dto),
      );
      expect(MockOpensearchRepository.createIndex).toBeCalledTimes(1);
      expect(MockOpensearchRepository.createIndex).toHaveBeenCalledWith({
        index: channelFixture.id.toString(),
      });
    });
    it('creating a channel fails with a duplicate name', async () => {
      const fieldCount = faker.datatype.number({ min: 1, max: 10 });
      const dto = new CreateChannelDto();
      dto.name = faker.datatype.string();
      dto.description = faker.datatype.string();
      dto.projectId = faker.datatype.number();
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

      expect(channelRepo.save).not.toBeCalled();
      expect(MockOpensearchRepository.createIndex).not.toBeCalled();
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
      dto.channelId = faker.datatype.number();
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
      dto.name = faker.datatype.string();
      dto.description = faker.datatype.string();
      jest
        .spyOn(ChannelMySQLService.prototype, 'findById')
        .mockResolvedValue(channelFixture);
      jest.spyOn(channelRepo, 'findOne').mockResolvedValue(null);

      await channelService.updateInfo(channelId, dto);

      expect(channelRepo.update).toBeCalledTimes(1);
      expect(channelRepo.update).toHaveBeenCalledWith(channelId, {
        id: channelId,
        ...dto,
      });
    });
    it('updating fails with a duplicate channel name', async () => {
      const channelId = channelFixture.id;
      const dto = new UpdateChannelDto();
      dto.name = channelFixture.name;
      dto.description = faker.datatype.string();
      jest
        .spyOn(ChannelMySQLService.prototype, 'findById')
        .mockResolvedValue(channelFixture);
      jest
        .spyOn(channelRepo, 'findOne')
        .mockResolvedValue({ ...channelFixture, id: faker.datatype.number() });

      await expect(channelService.updateInfo(channelId, dto)).rejects.toThrow(
        ChannelInvalidNameException,
      );
    });
  });

  describe('deleteById', () => {
    it('deleting by an id succeeds with a valid id', async () => {
      const channelId = faker.datatype.number();
      const channel = new ChannelEntity();
      channel.id = channelId;

      await channelService.deleteById(channelId);

      expect(channelRepo.remove).toBeCalledTimes(1);
      expect(channelRepo.remove).toHaveBeenCalledWith(channel);
    });
  });
});
