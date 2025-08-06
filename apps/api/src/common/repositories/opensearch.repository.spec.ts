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
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { Client } from '@opensearch-project/opensearch';
import type { TextProperty } from '@opensearch-project/opensearch/api/_types/_common.mapping';

import { getMockProvider } from '@/test-utils/util-functions';
import { CreateDataDto, PutMappingsDto } from './dtos';
import { OpensearchRepository } from './opensearch.repository';

const MockClient = {
  indices: {
    create: jest.fn(),
    putAlias: jest.fn(),
    exists: jest.fn(),
    putMapping: jest.fn(),
    getMapping: jest.fn(),
    delete: jest.fn(),
  },
  index: jest.fn(),
  search: jest.fn(),
  scroll: jest.fn(),
  update: jest.fn(),
  deleteByQuery: jest.fn(),
  count: jest.fn(),
};

const OpensearchRepositoryProviders = [
  OpensearchRepository,
  getMockProvider('OPENSEARCH_CLIENT', MockClient),
];

const COMPLICATE_JSON = {
  KEY1: 'VALUE1',
  KEY2: 'VALUE2',
};

const MAPPING_JSON = {
  KEY1: {
    type: 'text',
  } as TextProperty,
};

describe('Opensearch Repository Test suite', () => {
  let osRepo: OpensearchRepository;
  let osClient: Client;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: OpensearchRepositoryProviders,
    }).compile();
    osRepo = module.get(OpensearchRepository);
    osClient = module.get('OPENSEARCH_CLIENT');
  });

  describe('create index', () => {
    it('positive case', async () => {
      const index = faker.number.int().toString();
      const indexName = 'channel_' + index;
      jest.spyOn(osClient.indices, 'create');
      jest.spyOn(osClient.indices, 'putAlias');

      await osRepo.createIndex({ index });

      expect(osClient.indices.create).toHaveBeenCalledTimes(1);
      expect(osClient.indices.create).toHaveBeenCalledWith({
        index: indexName,
        body: {
          settings: {
            index: { max_ngram_diff: 1 },
            analysis: {
              analyzer: {
                ngram_analyzer: {
                  filter: ['lowercase', 'asciifolding', 'cjk_width'],
                  tokenizer: 'ngram_tokenizer',
                  type: 'custom',
                },
              },
              tokenizer: {
                ngram_tokenizer: {
                  type: 'ngram',
                  min_gram: 1,
                  max_gram: 2,
                  token_chars: ['letter', 'digit', 'punctuation', 'symbol'],
                },
              },
            },
          },
        },
      });
      expect(osClient.indices.putAlias).toHaveBeenCalledTimes(1);
      expect(osClient.indices.putAlias).toHaveBeenCalledWith({
        index: indexName,
        name: index,
      });
    });
  });

  describe('putMappings', () => {
    it('putting mappings succeeds with an existent index', async () => {
      const dto = new PutMappingsDto();
      dto.index = faker.number.int().toString();
      dto.mappings = MAPPING_JSON;
      jest
        .spyOn(osClient.indices, 'exists')
        .mockResolvedValue({ statusCode: 200 } as never);
      jest.spyOn(osClient.indices, 'putMapping');

      await osRepo.putMappings(dto);

      expect(osClient.indices.exists).toHaveBeenCalledTimes(1);
      expect(osClient.indices.putMapping).toHaveBeenCalledTimes(1);
      expect(osClient.indices.putMapping).toHaveBeenCalledWith({
        index: dto.index,
        body: { properties: dto.mappings },
      });
    });
    it('putting mappings fails with a nonexistent index', async () => {
      const dto = new PutMappingsDto();
      dto.index = faker.number.int().toString();
      dto.mappings = MAPPING_JSON;
      jest
        .spyOn(osClient.indices, 'exists')
        .mockResolvedValue({ statusCode: 404 } as never);
      jest.spyOn(osClient.indices, 'putMapping');

      await expect(osRepo.putMappings(dto)).rejects.toThrow(
        new NotFoundException('index is not found'),
      );

      expect(osClient.indices.exists).toHaveBeenCalledTimes(1);
      expect(osClient.indices.putMapping).not.toHaveBeenCalled();
    });
  });

  describe('createData', () => {
    it('creating data succeeds with valid inputs', async () => {
      const index = faker.number.int().toString();
      const id = faker.number.int().toString();
      const dto = new CreateDataDto();
      dto.id = id;
      dto.index = index;
      dto.data = COMPLICATE_JSON;
      jest
        .spyOn(osClient.indices, 'exists')
        .mockResolvedValue({ statusCode: 200 } as never);
      jest.spyOn(osClient.indices, 'getMapping').mockResolvedValue({
        body: {
          ['channel_' + index]: {
            mappings: {
              properties: dto.data,
            },
          },
        },
      } as never);
      jest.spyOn(osClient, 'index').mockResolvedValue({
        body: {
          _id: dto.id,
        },
      } as never);

      const response = await osRepo.createData(dto);

      expect(response.id).toEqual(dto.id);
      expect(osClient.indices.getMapping).toHaveBeenCalledTimes(1);
      expect(osClient.index).toHaveBeenCalledTimes(1);
      expect(osClient.index).toHaveBeenCalledWith({
        id: dto.id,
        index: 'channel_' + index,
        body: dto.data,
        refresh: true,
      });
    });
    it('creating data fails with an invalid index', async () => {
      const invalidIndex = faker.number.int().toString();
      const id = faker.number.int().toString();
      const dto = new CreateDataDto();
      dto.id = id;
      dto.index = invalidIndex;
      dto.data = COMPLICATE_JSON;
      jest
        .spyOn(osClient.indices, 'exists')
        .mockResolvedValue({ body: false } as never);
      jest.spyOn(osClient.indices, 'getMapping').mockResolvedValue({
        body: {
          ['channel_' + faker.number.int().toString()]: {
            mappings: {
              properties: dto.data,
            },
          },
        },
      } as never);
      jest.spyOn(osClient, 'index').mockResolvedValue({
        body: {
          _id: dto.id,
        },
      } as never);

      await expect(osRepo.createData(dto)).rejects.toThrow(
        new NotFoundException('index is not found'),
      );

      expect(osClient.indices.exists).toHaveBeenCalledTimes(1);
      expect(osClient.indices.getMapping).not.toHaveBeenCalled();
      expect(osClient.index).not.toHaveBeenCalled();
    });
    it('creating data fails with invalid data', async () => {
      const index = faker.number.int().toString();
      const id = faker.number.int().toString();
      const data = COMPLICATE_JSON;
      const dto = new CreateDataDto();
      dto.id = id;
      dto.index = index;
      dto.data = {
        ...data,
        invalidKey: 'invalidValue',
      };
      jest
        .spyOn(osClient.indices, 'exists')
        .mockResolvedValue({ statusCode: 200 } as never);
      jest.spyOn(osClient.indices, 'getMapping').mockResolvedValue({
        body: {
          ['channel_' + index]: {
            mappings: {
              properties: data,
            },
          },
        },
      } as never);
      jest.spyOn(osClient, 'index').mockResolvedValue({
        body: {
          _id: dto.id,
        },
      } as never);

      await expect(osRepo.createData(dto)).rejects.toThrow(
        new InternalServerErrorException('error!!!'),
      );

      expect(osClient.indices.exists).toHaveBeenCalledTimes(1);
      expect(osClient.indices.getMapping).toHaveBeenCalledTimes(1);
      expect(osClient.index).not.toHaveBeenCalled();
    });
  });

  describe('getData', () => {
    return;
  });

  describe('scroll', () => {
    return;
  });

  describe('updateData', () => {
    return;
  });

  describe('deleteBulkData', () => {
    return;
  });

  describe('deleteIndex', () => {
    return;
  });

  describe('getTotal', () => {
    return;
  });
});
