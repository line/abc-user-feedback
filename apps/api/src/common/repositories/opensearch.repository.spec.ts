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
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Client } from '@opensearch-project/opensearch';

import { TestConfigs, getMockProvider } from '@/utils/test-utils';

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

describe('Opensearch Repository Test suite', () => {
  let osRepo: OpensearchRepository;
  let osClient: Client;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [...TestConfigs],
      providers: OpensearchRepositoryProviders,
    }).compile();
    osRepo = module.get(OpensearchRepository);
    osClient = module.get('OPENSEARCH_CLIENT');
  });

  describe('create index', () => {
    it('positive case', async () => {
      const index = faker.datatype.number().toString();
      const indexName = 'channel_' + index;
      jest.spyOn(osClient.indices, 'create');
      jest.spyOn(osClient.indices, 'putAlias');

      await osRepo.createIndex({ index });

      expect(osClient.indices.create).toBeCalledTimes(1);
      expect(osClient.indices.create).toBeCalledWith({
        index: indexName,
        body: {
          settings: {
            index: { max_ngram_diff: 1 },
            analysis: {
              analyzer: {
                ngram_analyzer: {
                  filter: ['lowercase', 'asciifolding', 'cjk_width'],
                  tokenizer: 'ngram_tokenizer',
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
      expect(osClient.indices.putAlias).toBeCalledTimes(1);
      expect(osClient.indices.putAlias).toBeCalledWith({
        index: indexName,
        name: index,
      });
    });
  });

  describe('putMappings', () => {
    it('putting mappings succeeds with an existent index', async () => {
      const dto = new PutMappingsDto();
      dto.index = faker.datatype.number().toString();
      dto.mappings = JSON.parse(faker.datatype.json());
      jest
        .spyOn(osClient.indices, 'exists')
        .mockResolvedValue({ body: true } as never);
      jest.spyOn(osClient.indices, 'putMapping');

      await osRepo.putMappings(dto);

      expect(osClient.indices.exists).toBeCalledTimes(1);
      expect(osClient.indices.putMapping).toBeCalledTimes(1);
      expect(osClient.indices.putMapping).toBeCalledWith({
        index: dto.index,
        body: { properties: dto.mappings },
      });
    });
    it('putting mappings fails with a nonexistent index', async () => {
      const dto = new PutMappingsDto();
      dto.index = faker.datatype.number().toString();
      dto.mappings = JSON.parse(faker.datatype.json());
      jest
        .spyOn(osClient.indices, 'exists')
        .mockResolvedValue({ body: false } as never);
      jest.spyOn(osClient.indices, 'putMapping');

      await expect(osRepo.putMappings(dto)).rejects.toThrowError(
        new NotFoundException('index is not found'),
      );

      expect(osClient.indices.exists).toBeCalledTimes(1);
      expect(osClient.indices.putMapping).not.toBeCalled();
    });
  });

  describe('createData', () => {
    it('creating data succeeds with valid inputs', async () => {
      const index = faker.datatype.number().toString();
      const id = faker.datatype.number().toString();
      const dto = new CreateDataDto();
      dto.id = id;
      dto.index = index;
      dto.data = JSON.parse(faker.datatype.json());
      jest
        .spyOn(osClient.indices, 'exists')
        .mockResolvedValue({ body: true } as never);
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
      expect(osClient.indices.getMapping).toBeCalledTimes(1);
      expect(osClient.index).toBeCalledTimes(1);
      expect(osClient.index).toBeCalledWith({
        id: dto.id,
        index: 'channel_' + index,
        body: dto.data,
        refresh: true,
      });
    });
    it('creating data fails with an invalid index', async () => {
      const invalidIndex = faker.datatype.number().toString();
      const id = faker.datatype.number().toString();
      const dto = new CreateDataDto();
      dto.id = id;
      dto.index = invalidIndex;
      dto.data = JSON.parse(faker.datatype.json());
      jest
        .spyOn(osClient.indices, 'exists')
        .mockResolvedValue({ body: false } as never);
      jest.spyOn(osClient.indices, 'getMapping').mockResolvedValue({
        body: {
          ['channel_' + faker.datatype.number().toString()]: {
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

      await expect(osRepo.createData(dto)).rejects.toThrowError(
        new NotFoundException('index is not found'),
      );

      expect(osClient.indices.exists).toBeCalledTimes(1);
      expect(osClient.indices.getMapping).not.toBeCalled();
      expect(osClient.index).not.toBeCalled();
    });
    it('creating data fails with invalid data', async () => {
      const index = faker.datatype.number().toString();
      const id = faker.datatype.number().toString();
      const data = JSON.parse(faker.datatype.json());
      const dto = new CreateDataDto();
      dto.id = id;
      dto.index = index;
      dto.data = {
        ...data,
        invalidKey: 'invalidValue',
      };
      jest
        .spyOn(osClient.indices, 'exists')
        .mockResolvedValue({ body: true } as never);
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

      await expect(osRepo.createData(dto)).rejects.toThrowError(
        new InternalServerErrorException('error!!!'),
      );

      expect(osClient.indices.exists).toBeCalledTimes(1);
      expect(osClient.indices.getMapping).toBeCalledTimes(1);
      expect(osClient.index).not.toBeCalled();
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  describe('getData', () => {});

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  describe('scroll', () => {});

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  describe('updateData', () => {});

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  describe('deleteBulkData', () => {});

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  describe('deleteIndex', () => {});

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  describe('getTotal', () => {});
});
