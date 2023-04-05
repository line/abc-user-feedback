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
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { createFieldDto } from '@/utils/test-util-fixture';
import {
  TestConfigs,
  clearEntities,
  getMockProvider,
} from '@/utils/test-utils';

import { ChannelEntity } from '../entities/channel.entity';
import { ProjectEntity } from '../entities/project.entity';
import { ElasticsearchRepository } from '../repositories';
import { FindByChannelIdDto } from '../repositories/dtos';
import { ChannelService } from './channel.service';
import {
  CreateChannelDto,
  FindAllChannelsByProjectIdDto,
  UpdateChannelDto,
} from './dtos';
import { FieldService } from './field.service';

describe('Channel Test suite', () => {
  let channelService: ChannelService;

  let dataSource: DataSource;
  let projectRepo: Repository<ProjectEntity>;
  let channelRepo: Repository<ChannelEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ...TestConfigs,
        TypeOrmModule.forFeature([ProjectEntity, ChannelEntity]),
      ],
      providers: [
        ChannelService,
        getMockProvider(FieldService, MockFieldService),
        getMockProvider(ElasticsearchRepository, MockElasticsearchRepository),
      ],
    }).compile();

    channelService = module.get<ChannelService>(ChannelService);

    dataSource = module.get(DataSource);
    projectRepo = dataSource.getRepository(ProjectEntity);
    channelRepo = dataSource.getRepository(ChannelEntity);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await clearEntities([channelRepo, projectRepo]);
  });

  describe('create channel', () => {
    let project: ProjectEntity;
    beforeEach(async () => {
      project = await projectRepo.save({
        name: faker.datatype.string(),
        description: faker.datatype.string(),
      });
    });
    it('positive case', async () => {
      const fieldCount = faker.datatype.number({ min: 1, max: 10 });

      const dto = new CreateChannelDto();
      dto.name = faker.datatype.string();
      dto.description = faker.datatype.string();
      dto.projectId = project.id;
      dto.fields = Array.from({ length: fieldCount }).map(createFieldDto);

      const { id } = await channelService.create(dto);

      const channel = await channelRepo.findOne({
        where: { id },
        relations: { project: true },
      });
      expect(channel.name).toEqual(dto.name);
      expect(channel.description).toEqual(dto.description);
      expect(channel.project.id).toEqual(dto.projectId);

      expect(MockFieldService.createMany).toBeCalledTimes(1);
      expect(MockElasticsearchRepository.createIndex).toBeCalledTimes(1);
    });
  });

  describe('find channel ', () => {
    let total: number;
    let project: ProjectEntity;

    beforeEach(async () => {
      total = faker.datatype.number({ min: 10, max: 20 });

      project = await projectRepo.save({
        name: faker.datatype.string(),
        description: faker.datatype.string(),
      });

      await channelRepo.save(
        Array.from({ length: total }).map(() => ({
          name: faker.datatype.string(),
          description: faker.datatype.string(),
          project,
        })),
      );
    });

    it('positive case', async () => {
      const dto = new FindAllChannelsByProjectIdDto();
      dto.options = { limit: 10, page: 1 };
      dto.projectId = project.id;

      const { items, meta } = await channelService.findAllByProjectId(dto);
      expect(items).toHaveLength(+dto.options.limit);
      expect(meta.totalItems).toEqual(total);
    });

    it('keyword', async () => {
      const dto = new FindAllChannelsByProjectIdDto();
      dto.options = { limit: 10, page: 1 };
      dto.projectId = project.id;
      dto.keyword = faker.datatype.string(3);

      const result = await channelService.findAllByProjectId(dto);
      expect(result.items.every((v) => v.name.includes(dto.keyword))).toEqual(
        true,
      );
    });
  });
  describe('find by channel id ', () => {
    let total: number;
    let channels: ChannelEntity[];

    beforeEach(async () => {
      total = faker.datatype.number({ min: 10, max: 20 });
      channels = await channelRepo.save(
        Array.from({ length: total }).map(() => ({
          name: faker.datatype.string(),
          description: faker.datatype.string(),
        })),
      );
    });
    it('positive case', async () => {
      const index = faker.datatype.number(total - 1);
      const dto = new FindByChannelIdDto();
      dto.channelId = channels[index].id;

      const result = await channelService.findById(dto);
      expect(result).toMatchObject(channels[index]);
    });
  });

  describe('update ', () => {
    let total: number;
    let project: ProjectEntity;
    let channels: ChannelEntity[];

    beforeEach(async () => {
      total = faker.datatype.number({ min: 10, max: 20 });
      project = await projectRepo.save({
        name: faker.datatype.string(),
        description: faker.datatype.string(),
      });
      channels = await channelRepo.save(
        Array.from({ length: total }).map(() => ({
          name: faker.datatype.string(),
          description: faker.datatype.string(),
          project,
        })),
      );
    });

    it('positive case', async () => {
      const index = faker.datatype.number(total - 1);

      const fieldCount = faker.datatype.number({ min: 1, max: 10 });

      const dto = new UpdateChannelDto();
      dto.channelId = channels[index].id;
      dto.name = faker.datatype.string();
      dto.description = faker.datatype.string();
      dto.fields = Array.from({ length: fieldCount }).map(createFieldDto);

      await channelService.update(dto);

      const channel = await channelRepo.findOneBy({ id: dto.channelId });
      expect(channel.name).toEqual(dto.name);
      expect(channel.description).toEqual(dto.description);

      expect(MockFieldService.replaceMany).toBeCalledTimes(1);
    });
  });
});

const MockFieldService = {
  createMany: jest.fn(),
  replaceMany: jest.fn(),
};
const MockElasticsearchRepository = {
  createIndex: jest.fn(),
};
