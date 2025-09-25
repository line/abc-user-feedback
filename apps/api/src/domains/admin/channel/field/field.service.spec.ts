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
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Indices_PutMapping_Response } from '@opensearch-project/opensearch/api';
import type { Repository } from 'typeorm';

import { FieldFormatEnum, isSelectFieldFormat } from '@/common/enums';
import { OpensearchRepository } from '@/common/repositories';
import { createFieldDto, updateFieldDto } from '@/test-utils/fixtures';
import { TestConfig } from '@/test-utils/util-functions';
import { FieldServiceProviders } from '../../../../test-utils/providers/field.service.providers';
import { OptionEntity } from '../option/option.entity';
import type { CreateFieldDto, ReplaceFieldDto } from './dtos';
import { CreateManyFieldsDto, ReplaceManyFieldsDto } from './dtos';
import {
  FieldKeyDuplicatedException,
  FieldNameDuplicatedException,
} from './exceptions';
import { FieldEntity } from './field.entity';
import { FieldMySQLService } from './field.mysql.service';
import { FieldService } from './field.service';

const countSelect = (prev: number, curr: CreateFieldDto): number => {
  return (
      isSelectFieldFormat(curr.format) &&
        curr.options &&
        curr.options.length > 0
    ) ?
      prev + 1
    : prev;
};

describe('FieldService suite', () => {
  let fieldService: FieldService;
  let fieldRepo: Repository<FieldEntity>;
  let optionRepo: Repository<OptionEntity>;
  let fieldMySQLService: FieldMySQLService;
  let osRepository: OpensearchRepository;
  let configService: ConfigService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: FieldServiceProviders,
    }).compile();

    fieldService = module.get<FieldService>(FieldService);
    fieldRepo = module.get(getRepositoryToken(FieldEntity));
    optionRepo = module.get(getRepositoryToken(OptionEntity));
    fieldMySQLService = module.get<FieldMySQLService>(FieldMySQLService);
    osRepository = module.get<OpensearchRepository>(OpensearchRepository);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('fieldsToMapping', () => {
    it('should create correct mapping for text field', () => {
      const fields = [
        {
          key: 'testText',
          format: FieldFormatEnum.text,
        } as FieldEntity,
      ];

      const mapping = fieldService.fieldsToMapping(fields);

      expect(mapping.testText).toEqual({
        type: 'text',
        analyzer: 'ngram_analyzer',
        search_analyzer: 'ngram_analyzer',
      });
    });

    it('should create correct mapping for keyword field', () => {
      const fields = [
        {
          key: 'testKeyword',
          format: FieldFormatEnum.keyword,
        } as FieldEntity,
      ];

      const mapping = fieldService.fieldsToMapping(fields);

      expect(mapping.testKeyword).toEqual({
        type: 'keyword',
      });
    });

    it('should create correct mapping for number field', () => {
      const fields = [
        {
          key: 'testNumber',
          format: FieldFormatEnum.number,
        } as FieldEntity,
      ];

      const mapping = fieldService.fieldsToMapping(fields);

      expect(mapping.testNumber).toEqual({
        type: 'integer',
      });
    });

    it('should create correct mapping for select field', () => {
      const fields = [
        {
          key: 'testSelect',
          format: FieldFormatEnum.select,
        } as FieldEntity,
      ];

      const mapping = fieldService.fieldsToMapping(fields);

      expect(mapping.testSelect).toEqual({
        type: 'keyword',
      });
    });

    it('should create correct mapping for multiSelect field', () => {
      const fields = [
        {
          key: 'testMultiSelect',
          format: FieldFormatEnum.multiSelect,
        } as FieldEntity,
      ];

      const mapping = fieldService.fieldsToMapping(fields);

      expect(mapping.testMultiSelect).toEqual({
        type: 'keyword',
      });
    });

    it('should create correct mapping for date field', () => {
      const fields = [
        {
          key: 'testDate',
          format: FieldFormatEnum.date,
        } as FieldEntity,
      ];

      const mapping = fieldService.fieldsToMapping(fields);

      expect(mapping.testDate).toEqual({
        type: 'date',
        format:
          'yyyy-MM-dd HH:mm:ss||yyyy-MM-dd HH:mm:ssZ||yyyy-MM-dd HH:mm:ssZZZZZ||yyyy-MM-dd||epoch_millis||strict_date_optional_time',
      });
    });

    it('should create correct mapping for images field', () => {
      const fields = [
        {
          key: 'testImages',
          format: FieldFormatEnum.images,
        } as FieldEntity,
      ];

      const mapping = fieldService.fieldsToMapping(fields);

      expect(mapping.testImages).toEqual({
        type: 'text',
        analyzer: 'ngram_analyzer',
        search_analyzer: 'ngram_analyzer',
      });
    });

    it('should create correct mapping for aiField', () => {
      const fields = [
        {
          key: 'testAiField',
          format: FieldFormatEnum.aiField,
        } as FieldEntity,
      ];

      const mapping = fieldService.fieldsToMapping(fields);

      expect(mapping.testAiField).toEqual({
        type: 'object',
        properties: {
          status: { type: 'text' },
          message: {
            type: 'text',
            analyzer: 'ngram_analyzer',
            search_analyzer: 'ngram_analyzer',
          },
        },
      });
    });

    it('should create mapping for multiple fields', () => {
      const fields = [
        {
          key: 'field1',
          format: FieldFormatEnum.text,
        } as FieldEntity,
        {
          key: 'field2',
          format: FieldFormatEnum.number,
        } as FieldEntity,
        {
          key: 'field3',
          format: FieldFormatEnum.keyword,
        } as FieldEntity,
      ];

      const mapping = fieldService.fieldsToMapping(fields);

      expect(Object.keys(mapping)).toHaveLength(3);
      expect(mapping.field1.type).toBe('text');
      expect(mapping.field2.type).toBe('integer');
      expect(mapping.field3.type).toBe('keyword');
    });

    it('should return empty object for empty fields array', () => {
      const mapping = fieldService.fieldsToMapping([]);

      expect(mapping).toEqual({});
    });
  });

  describe('createMany', () => {
    it('creating many fields succeeds with valid inputs', async () => {
      const channelId = faker.number.int();
      const fieldCount = faker.number.int({ min: 1, max: 10 });
      const dto = new CreateManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = Array.from({ length: fieldCount }).map(createFieldDto);
      const selectFieldCount = dto.fields.reduce(countSelect, 0);
      jest.spyOn(fieldRepo, 'save');
      jest.spyOn(optionRepo, 'save');

      const fields = await fieldService.createMany(dto);

      expect(fields.length).toBe(fieldCount + 4);

      expect(optionRepo.save).toHaveBeenCalledTimes(selectFieldCount);
    });

    it('creating many fields with OpenSearch enabled should call putMappings', async () => {
      const channelId = faker.number.int();
      const dto = new CreateManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [createFieldDto()];

      const mockFields = [createFieldDto({})] as FieldEntity[];
      jest.spyOn(fieldMySQLService, 'createMany').mockResolvedValue(mockFields);
      jest.spyOn(configService, 'get').mockReturnValue(true);
      jest
        .spyOn(osRepository, 'putMappings')
        .mockResolvedValue({} as Indices_PutMapping_Response);

      await fieldService.createMany(dto);

      expect(osRepository.putMappings).toHaveBeenCalledWith({
        index: channelId.toString(),

        mappings: expect.any(Object),
      });
    });

    it('creating many fields with OpenSearch disabled should not call putMappings', async () => {
      const channelId = faker.number.int();
      const dto = new CreateManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [createFieldDto()];

      const mockFields = [createFieldDto({})] as FieldEntity[];
      jest.spyOn(fieldMySQLService, 'createMany').mockResolvedValue(mockFields);
      jest.spyOn(configService, 'get').mockReturnValue(false);
      jest
        .spyOn(osRepository, 'putMappings')
        .mockResolvedValue({} as Indices_PutMapping_Response);

      await fieldService.createMany(dto);

      expect(osRepository.putMappings).not.toHaveBeenCalled();
    });
    it('creating many fields fails with duplicate names', async () => {
      const channelId = faker.number.int();
      const dto = new CreateManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = Array.from({ length: 2 }).map(() =>
        createFieldDto({ name: 'duplicateName' }),
      );

      await expect(fieldService.createMany(dto)).rejects.toThrow(
        FieldNameDuplicatedException,
      );
    });
    it('creating many fields fails with duplicate keys', async () => {
      const channelId = faker.number.int();
      const dto = new CreateManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = Array.from({ length: 2 }).map(() =>
        createFieldDto({ key: 'duplicateKey' }),
      );

      await expect(fieldService.createMany(dto)).rejects.toThrow(
        FieldKeyDuplicatedException,
      );
    });
    it('creating many fields fails with options in non-select format field', async () => {
      const channelId = faker.number.int();
      const dto = new CreateManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = Array.from({ length: 1 }).map(() =>
        createFieldDto({
          format: FieldFormatEnum.text,
          options: [
            { key: faker.string.sample(), name: faker.string.sample() },
          ],
        }),
      );

      await expect(fieldService.createMany(dto)).rejects.toThrow(
        new BadRequestException('only select format field has options'),
      );
    });

    it('creating many fields fails with invalid field key containing special characters', async () => {
      const channelId = faker.number.int();
      const dto = new CreateManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [createFieldDto({ key: 'invalid-key!' })];

      await expect(fieldService.createMany(dto)).rejects.toThrow(
        new BadRequestException(
          'field key only should contain alphanumeric and underscore',
        ),
      );
    });

    it('creating many fields fails with reserved field name', async () => {
      const channelId = faker.number.int();
      const dto = new CreateManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [createFieldDto({ name: 'ID' })];

      await expect(fieldService.createMany(dto)).rejects.toThrow(
        new BadRequestException('name is rejected'),
      );
    });

    it('creating many fields fails with reserved field key', async () => {
      const channelId = faker.number.int();
      const dto = new CreateManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [createFieldDto({ key: 'id' })];

      await expect(fieldService.createMany(dto)).rejects.toThrow(
        new BadRequestException('key is rejected'),
      );
    });
  });
  describe('replaceMany', () => {
    it('replacing many fields succeeds with valid inputs', async () => {
      const channelId = faker.number.int();
      const updatingFieldDtos = Array.from({
        length: faker.number.int({ min: 1, max: 10 }),
      }).map(updateFieldDto);
      const creatingFieldDtos = Array.from({
        length: faker.number.int({ min: 1, max: 10 }),
      }).map(createFieldDto);
      const dto = new ReplaceManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [...creatingFieldDtos, ...updatingFieldDtos];
      jest
        .spyOn(fieldRepo, 'findBy')
        .mockResolvedValue(updatingFieldDtos as FieldEntity[]);
      jest.spyOn(optionRepo, 'find').mockResolvedValue([]);
      jest.spyOn(fieldRepo, 'save');

      await fieldService.replaceMany(dto);

      expect(fieldRepo.save).toHaveBeenCalledTimes(
        updatingFieldDtos.length + creatingFieldDtos.length,
      );
    });

    it('replacing many fields with OpenSearch enabled should call putMappings', async () => {
      const channelId = faker.number.int();
      const dto = new ReplaceManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [updateFieldDto({})];

      const mockFields = [createFieldDto({})] as FieldEntity[];
      jest
        .spyOn(fieldMySQLService, 'replaceMany')
        .mockResolvedValue(mockFields);
      jest.spyOn(configService, 'get').mockReturnValue(true);
      jest
        .spyOn(osRepository, 'putMappings')
        .mockResolvedValue({} as Indices_PutMapping_Response);

      await fieldService.replaceMany(dto);

      expect(osRepository.putMappings).toHaveBeenCalledWith({
        index: channelId.toString(),

        mappings: expect.any(Object),
      });
    });

    it('replacing many fields with OpenSearch disabled should not call putMappings', async () => {
      const channelId = faker.number.int();
      const dto = new ReplaceManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [updateFieldDto({})];

      const mockFields = [createFieldDto({})] as FieldEntity[];
      jest
        .spyOn(fieldMySQLService, 'replaceMany')
        .mockResolvedValue(mockFields);
      jest.spyOn(configService, 'get').mockReturnValue(false);
      jest
        .spyOn(osRepository, 'putMappings')
        .mockResolvedValue({} as Indices_PutMapping_Response);

      await fieldService.replaceMany(dto);

      expect(osRepository.putMappings).not.toHaveBeenCalled();
    });
    it('replacing many fields fails with duplicate names', async () => {
      const channelId = faker.number.int();
      const updatingFieldDtos = Array.from({
        length: 2,
      }).map(() => updateFieldDto({ name: 'duplicateName' }));
      const dto = new ReplaceManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [...updatingFieldDtos];
      jest
        .spyOn(fieldRepo, 'findBy')
        .mockResolvedValue(updatingFieldDtos as FieldEntity[]);
      jest.spyOn(optionRepo, 'find').mockResolvedValue([]);

      await expect(fieldService.replaceMany(dto)).rejects.toThrow(
        FieldNameDuplicatedException,
      );
    });
    it('replacing many fields fails with duplicate keys', async () => {
      const channelId = faker.number.int();
      const updatingFieldDtos = Array.from({
        length: 2,
      }).map(() => updateFieldDto({ key: 'duplicateKey' }));
      const dto = new ReplaceManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [...updatingFieldDtos];
      jest
        .spyOn(fieldRepo, 'findBy')
        .mockResolvedValue(updatingFieldDtos as FieldEntity[]);
      jest.spyOn(optionRepo, 'find').mockResolvedValue([]);

      await expect(fieldService.replaceMany(dto)).rejects.toThrow(
        FieldKeyDuplicatedException,
      );
    });
    it('replacing many fields fails with options in non-select format field', async () => {
      const channelId = faker.number.int();
      const updatingFieldDtos = Array.from({
        length: 1,
      }).map(() =>
        updateFieldDto({
          format: FieldFormatEnum.text,
          options: [
            { key: faker.string.sample(), name: faker.string.sample() },
          ],
        }),
      );
      const dto = new ReplaceManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [...updatingFieldDtos];
      jest
        .spyOn(fieldRepo, 'findBy')
        .mockResolvedValue(updatingFieldDtos as FieldEntity[]);
      jest.spyOn(optionRepo, 'find').mockResolvedValue([]);

      await expect(fieldService.replaceMany(dto)).rejects.toThrow(
        new BadRequestException('only select format field has options'),
      );
    });
    it('replacing many fields fails with a nonexistent field', async () => {
      const channelId = faker.number.int();
      const updatingFieldDtos = Array.from({
        length: faker.number.int({ min: 1, max: 10 }),
      }).map(updateFieldDto);
      const creatingFieldDtos = Array.from({
        length: faker.number.int({ min: 1, max: 10 }),
      }).map(createFieldDto);
      const dto = new ReplaceManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [...creatingFieldDtos, ...updatingFieldDtos];
      jest
        .spyOn(fieldRepo, 'findBy')
        .mockResolvedValue(updatingFieldDtos.splice(1) as FieldEntity[]);
      jest.spyOn(optionRepo, 'find').mockResolvedValue([]);

      await expect(fieldService.replaceMany(dto)).rejects.toThrow(
        new BadRequestException('field must be included'),
      );
    });
    it('replacing many fields fails with a format change', async () => {
      const channelId = faker.number.int();
      const updatingFieldDtos = Array.from({
        length: faker.number.int({ min: 1, max: 10 }),
      }).map(() => updateFieldDto({ format: FieldFormatEnum.keyword }));
      const dto = new ReplaceManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = JSON.parse(
        JSON.stringify(updatingFieldDtos),
      ) as ReplaceFieldDto[];
      jest.spyOn(fieldRepo, 'findBy').mockResolvedValue(
        updatingFieldDtos.map((field) => {
          field.format = FieldFormatEnum.text;
          return field;
        }) as FieldEntity[],
      );
      jest.spyOn(optionRepo, 'find').mockResolvedValue([]);

      await expect(fieldService.replaceMany(dto)).rejects.toThrow(
        new BadRequestException('field format cannot be changed'),
      );
    });
    it('replacing many fields fails with a key change', async () => {
      const channelId = faker.number.int();
      const updatingFieldDtos = Array.from({
        length: faker.number.int({ min: 1, max: 10 }),
      }).map(updateFieldDto);
      const dto = new ReplaceManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = JSON.parse(
        JSON.stringify(updatingFieldDtos),
      ) as ReplaceFieldDto[];
      jest.spyOn(fieldRepo, 'findBy').mockResolvedValue(
        updatingFieldDtos.map((field) => {
          field.key = faker.string.sample();
          return field;
        }) as FieldEntity[],
      );
      jest.spyOn(optionRepo, 'find').mockResolvedValue([]);

      await expect(fieldService.replaceMany(dto)).rejects.toThrow(
        new BadRequestException('field key cannot be changed'),
      );
    });

    it('replacing many fields fails with invalid field key containing special characters', async () => {
      const channelId = faker.number.int();
      const creatingFieldDtos = [createFieldDto({ key: 'invalid-key!' })];
      const dto = new ReplaceManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [...creatingFieldDtos];
      jest.spyOn(fieldRepo, 'findBy').mockResolvedValue([]);
      jest.spyOn(optionRepo, 'find').mockResolvedValue([]);

      await expect(fieldService.replaceMany(dto)).rejects.toThrow(
        new BadRequestException(
          'field key only should contain alphanumeric and underscore',
        ),
      );
    });

    it('replacing many fields fails with reserved field name in creating fields', async () => {
      const channelId = faker.number.int();
      const creatingFieldDtos = [createFieldDto({ name: 'ID' })];
      const dto = new ReplaceManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [...creatingFieldDtos];
      jest.spyOn(fieldRepo, 'findBy').mockResolvedValue([]);
      jest.spyOn(optionRepo, 'find').mockResolvedValue([]);

      await expect(fieldService.replaceMany(dto)).rejects.toThrow(
        new BadRequestException('name is rejected'),
      );
    });

    it('replacing many fields fails with reserved field key in creating fields', async () => {
      const channelId = faker.number.int();
      const creatingFieldDtos = [createFieldDto({ key: 'id' })];
      const dto = new ReplaceManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [...creatingFieldDtos];
      jest.spyOn(fieldRepo, 'findBy').mockResolvedValue([]);
      jest.spyOn(optionRepo, 'find').mockResolvedValue([]);

      await expect(fieldService.replaceMany(dto)).rejects.toThrow(
        new BadRequestException('key is rejected'),
      );
    });
  });

  describe('findByChannelId', () => {
    it('should return fields for given channel id', async () => {
      const channelId = faker.number.int();
      const mockFields = [createFieldDto(), createFieldDto()] as FieldEntity[];

      jest
        .spyOn(fieldMySQLService, 'findByChannelId')
        .mockResolvedValue(mockFields);

      const result = await fieldService.findByChannelId({ channelId });

      expect(fieldMySQLService.findByChannelId).toHaveBeenCalledWith({
        channelId,
      });
      expect(result).toEqual(mockFields);
    });

    it('should return empty array when no fields found', async () => {
      const channelId = faker.number.int();

      jest.spyOn(fieldMySQLService, 'findByChannelId').mockResolvedValue([]);

      const result = await fieldService.findByChannelId({ channelId });

      expect(result).toEqual([]);
    });
  });

  describe('findByIds', () => {
    it('should return fields for given ids', async () => {
      const ids = [faker.number.int(), faker.number.int()];
      const mockFields = [createFieldDto(), createFieldDto()] as FieldEntity[];

      jest.spyOn(fieldMySQLService, 'findByIds').mockResolvedValue(mockFields);

      const result = await fieldService.findByIds(ids);

      expect(fieldMySQLService.findByIds).toHaveBeenCalledWith(ids);
      expect(result).toEqual(mockFields);
    });

    it('should return empty array when no fields found', async () => {
      const ids = [faker.number.int()];

      jest.spyOn(fieldMySQLService, 'findByIds').mockResolvedValue([]);

      const result = await fieldService.findByIds(ids);

      expect(result).toEqual([]);
    });

    it('should handle empty ids array', async () => {
      jest.spyOn(fieldMySQLService, 'findByIds').mockResolvedValue([]);

      const result = await fieldService.findByIds([]);

      expect(fieldMySQLService.findByIds).toHaveBeenCalledWith([]);
      expect(result).toEqual([]);
    });
  });

  describe('edge cases', () => {
    it('createMany should handle empty fields array', async () => {
      const channelId = faker.number.int();
      const dto = new CreateManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [];

      const mockFields = [] as FieldEntity[];
      jest.spyOn(fieldMySQLService, 'createMany').mockResolvedValue(mockFields);
      jest.spyOn(configService, 'get').mockReturnValue(false);

      const result = await fieldService.createMany(dto);

      expect(result).toEqual([]);
      expect(fieldMySQLService.createMany).toHaveBeenCalledWith(dto);
    });

    it('replaceMany should handle empty fields array', async () => {
      const channelId = faker.number.int();
      const dto = new ReplaceManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [];

      const mockFields = [] as FieldEntity[];
      jest
        .spyOn(fieldMySQLService, 'replaceMany')
        .mockResolvedValue(mockFields);
      jest.spyOn(configService, 'get').mockReturnValue(false);

      await fieldService.replaceMany(dto);

      expect(fieldMySQLService.replaceMany).toHaveBeenCalledWith(dto);
    });

    it('createMany should handle null channelId', async () => {
      const dto = new CreateManyFieldsDto();
      dto.channelId = null as unknown as number;
      dto.fields = [createFieldDto()];

      const mockFields = [createFieldDto({})] as FieldEntity[];
      jest.spyOn(fieldMySQLService, 'createMany').mockResolvedValue(mockFields);
      jest.spyOn(configService, 'get').mockReturnValue(false);

      const result = await fieldService.createMany(dto);

      expect(result).toEqual(mockFields);
    });

    it('fieldsToMapping should handle fields with null/undefined properties', () => {
      const fields = [
        {
          key: 'testField',
          format: FieldFormatEnum.text,
        } as FieldEntity,
        {
          key: '',
          format: FieldFormatEnum.keyword,
        } as FieldEntity,
      ];

      const mapping = fieldService.fieldsToMapping(fields);

      expect(mapping.testField).toBeDefined();
      expect(mapping['']).toBeDefined();
    });

    it('createMany should handle fields with empty options array', async () => {
      const channelId = faker.number.int();
      const dto = new CreateManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [
        createFieldDto({
          format: FieldFormatEnum.select,
          options: [],
        }),
      ];

      const mockFields = [createFieldDto({})] as FieldEntity[];
      jest.spyOn(fieldMySQLService, 'createMany').mockResolvedValue(mockFields);
      jest.spyOn(configService, 'get').mockReturnValue(false);

      const result = await fieldService.createMany(dto);

      expect(result).toEqual(mockFields);
    });

    it('replaceMany should handle mixed creating and updating fields', async () => {
      const channelId = faker.number.int();
      const creatingFieldDtos = [createFieldDto({})];
      const updatingFieldDtos = [updateFieldDto({})];
      const dto = new ReplaceManyFieldsDto();
      dto.channelId = channelId;
      dto.fields = [...creatingFieldDtos, ...updatingFieldDtos];

      const mockFields = [createFieldDto({})] as FieldEntity[];
      jest
        .spyOn(fieldMySQLService, 'replaceMany')
        .mockResolvedValue(mockFields);
      jest.spyOn(configService, 'get').mockReturnValue(false);

      await fieldService.replaceMany(dto);

      expect(fieldMySQLService.replaceMany).toHaveBeenCalledWith(dto);
    });
  });
});
