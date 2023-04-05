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
import { FieldEntity } from '../entities/field.entity';
import { FieldNameDuplicatedException } from '../exceptions/fields';
import { ElasticsearchRepository } from '../repositories';
import { FieldTypeEnum } from './dtos/enums';
import { CreateManyFieldsDto, ReplaceManyFieldsDto } from './dtos/fields';
import { ReplaceFieldDto } from './dtos/fields/replace-field.dto';
import { FieldService } from './field.service';
import { OptionService } from './option.service';

const countSelect = (prev, curr) => {
  return curr.type === FieldTypeEnum.select && curr.options.length > 0
    ? prev + 1
    : prev;
};

describe('FieldRepositor suite', () => {
  let fieldService: FieldService;

  let dataSource: DataSource;
  let fieldRepo: Repository<FieldEntity>;
  let channelRepo: Repository<ChannelEntity>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ...TestConfigs,
        TypeOrmModule.forFeature([FieldEntity, ChannelEntity]),
      ],
      providers: [
        FieldService,
        getMockProvider(OptionService, MockOptionService),
        getMockProvider(ElasticsearchRepository, MockElasticsearchRepository),
      ],
    }).compile();

    fieldService = module.get<FieldService>(FieldService);

    dataSource = module.get(DataSource);
    fieldRepo = dataSource.getRepository(FieldEntity);
    channelRepo = dataSource.getRepository(ChannelEntity);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });
  beforeEach(async () => {
    await clearEntities([channelRepo, fieldRepo]);
  });

  describe('create fields', () => {
    let channel: ChannelEntity;

    beforeEach(async () => {
      channel = await channelRepo.save({
        name: faker.datatype.string(),
        description: faker.datatype.string(),
      });
    });

    it('', async () => {
      const fieldCount = faker.datatype.number({ min: 1, max: 10 });
      const dto = new CreateManyFieldsDto();
      dto.channelId = channel.id;
      dto.fields = Array.from({ length: fieldCount }).map(createFieldDto);

      await fieldService.createMany(dto);
      const fields = await fieldRepo.findBy({ channel: { id: channel.id } });
      expect(fields).toHaveLength(fieldCount + 2);

      expect(MockOptionService.createMany).toBeCalledTimes(
        dto.fields.reduce(countSelect, 0),
      );
      expect(MockElasticsearchRepository.putMappings).toBeCalledTimes(1);
    });

    it('check duplicated field name', async () => {
      const dto = new CreateManyFieldsDto();
      dto.channelId = channel.id;
      dto.fields = Array.from({ length: 2 }).map(() =>
        createFieldDto({ name: 'option' }),
      );
      await expect(fieldService.createMany(dto)).rejects.toThrow(
        FieldNameDuplicatedException,
      );
    });
  });
  // describe('findByChannelId', () => {});

  describe('replace many', () => {
    let channel: ChannelEntity;
    let fields: FieldEntity[];
    beforeEach(async () => {
      channel = await channelRepo.save({
        name: faker.datatype.string(),
        description: faker.datatype.string(),
      });
      const fieldCount = faker.datatype.number({ min: 1, max: 10 });

      fields = await fieldRepo.save(
        Array.from({ length: fieldCount })
          .map(createFieldDto)
          .map((v) => ({ ...v, channel })),
      );
    });

    it('', async () => {
      const updatingFieldDtos = fields.map(({ type, id }) =>
        replaceFieldDto({ type, id }),
      );

      const creatingFieldDtos = Array.from({
        length: faker.datatype.number({ min: 1, max: 10 }),
      }).map(replaceFieldDto);

      const dto = new ReplaceManyFieldsDto();
      dto.channelId = channel.id;
      dto.fields = [...creatingFieldDtos, ...updatingFieldDtos];

      //
      await fieldService.replaceMany(dto);

      //
      const results = await fieldRepo.find({
        where: { channel: { id: channel.id } },
        relations: { options: true },
      });
      expect(results).toHaveLength(fields.length + creatingFieldDtos.length);

      for (const dto of updatingFieldDtos) {
        const { name, type, description } = dto;
        const fieldEntity = results.find((result) => result.name === name);

        expect(fieldEntity.name).toEqual(name);
        expect(fieldEntity.description).toEqual(description);
        expect(fieldEntity.type).toEqual(type);
        // if (type === FieldTypeEnum.select) {
        //   expect(MockOptionService.replaceMany).toBeCalledWith({
        //     fieldId: fieldEntity.id,
        //     options,
        //   });
        // }
      }
      for (const dto of creatingFieldDtos) {
        const { name, type, description } = dto;

        const fieldEntity = results.find((result) => result.name === name);

        expect(fieldEntity.name).toEqual(name);
        expect(fieldEntity.description).toEqual(description);
        expect(fieldEntity.type).toEqual(type);

        // if (type === FieldTypeEnum.select) {
        //   expect(MockOptionService.createMany).toBeCalledWith({
        //     fieldId: fieldEntity.id,
        //     options,
        //   });
        // }
      }
      expect(MockOptionService.replaceMany).toBeCalledTimes(
        updatingFieldDtos.reduce(countSelect, 0),
      );
      expect(MockOptionService.createMany).toBeCalledTimes(
        creatingFieldDtos.reduce(countSelect, 0),
      );
      expect(MockElasticsearchRepository.putMappings).toBeCalledTimes(1);
    });
  });
});

const MockOptionService = {
  createMany: jest.fn(),
  replaceMany: jest.fn(),
};
const MockElasticsearchRepository = {
  putMappings: jest.fn(),
};

const replaceFieldDto = (input: Partial<ReplaceFieldDto>) => {
  return { ...input, ...createFieldDto(input) };
};
