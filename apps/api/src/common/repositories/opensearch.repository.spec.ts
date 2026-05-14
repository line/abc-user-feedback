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
import {CreateDataDto, PutMappingsDto} from './dtos';
import { OpensearchRepository } from './opensearch.repository';
import {SpaceType} from "@/common/repositories/dtos/create-knn-index.dto";

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

    it('creating index handles errors', async () => {
      const index = faker.number.int().toString();
      const error = new Error('Index creation failed');

      jest.spyOn(osClient.indices, 'create').mockRejectedValue(error as never);

      await expect(osRepo.createIndex({ index })).rejects.toThrow(
        'Index creation failed',
      );
    });

    it('creating index handles OpenSearch specific errors', async () => {
      const index = faker.number.int().toString();
      const error = {
        meta: {
          body: {
            error: {
              type: 'resource_already_exists_exception',
              reason: 'index already exists',
            },
          },
        },
      };

      jest.spyOn(osClient.indices, 'create').mockRejectedValue(error as never);

      await expect(osRepo.createIndex({ index })).rejects.toEqual(error);
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

    it('putting mappings handles OpenSearch errors', async () => {
      const dto = new PutMappingsDto();
      dto.index = faker.number.int().toString();
      dto.mappings = MAPPING_JSON;

      jest
        .spyOn(osClient.indices, 'exists')
        .mockResolvedValue({ statusCode: 200 } as never);

      const error = {
        meta: {
          body: {
            error: {
              type: 'illegal_argument_exception',
              reason: 'mapping update failed',
            },
          },
        },
      };

      jest
        .spyOn(osClient.indices, 'putMapping')
        .mockRejectedValue(error as never);

      await expect(osRepo.putMappings(dto)).rejects.toEqual(error);
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
    it('getting data succeeds with valid inputs', async () => {
      const index = faker.number.int().toString();
      const query = { bool: { must: [{ term: { status: 'active' } }] } };
      const sort = ['_id:desc'];
      const limit = 10;
      const page = 1;

      jest.spyOn(osClient, 'search').mockResolvedValue({
        body: {
          hits: {
            hits: [
              { _source: { KEY1: 'VALUE1' } },
              { _source: { KEY2: 'VALUE2' } },
            ],
            total: 2,
          },
        },
      } as never);

      const result = await osRepo.getData({ index, query, sort, limit, page });

      expect(result.items).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(osClient.search).toHaveBeenCalledWith({
        index,
        from: 0,
        size: limit,
        sort,
        body: { query },
      });
    });

    it('getting data with empty sort adds default sort', async () => {
      const index = faker.number.int().toString();
      const query = { bool: { must: [{ term: { status: 'active' } }] } };
      const sort: string[] = [];

      jest.spyOn(osClient, 'search').mockResolvedValue({
        body: {
          hits: {
            hits: [],
            total: 0,
          },
        },
      } as never);

      await osRepo.getData({ index, query, sort, page: 1, limit: 100 });

      expect(osClient.search).toHaveBeenCalledWith({
        index,
        from: 0,
        size: 100,
        sort: ['_id:desc'],
        body: { query },
      });
    });

    it('getting data handles large window exception', async () => {
      const index = faker.number.int().toString();
      const query = { bool: { must: [{ term: { status: 'active' } }] } };

      const error = new Error('Result window is too large');
      error.name = 'OpenSearchClientError';

      jest.spyOn(osClient, 'search').mockRejectedValue(error as never);

      await expect(
        osRepo.getData({ index, query, sort: [], page: 1, limit: 100 }),
      ).rejects.toThrow('Result window is too large');
    });

    it('getting data handles total as object', async () => {
      const index = faker.number.int().toString();
      const query = { bool: { must: [{ term: { status: 'active' } }] } };

      jest.spyOn(osClient, 'search').mockResolvedValue({
        body: {
          hits: {
            hits: [],
            total: { value: 100, relation: 'eq' },
          },
        },
      } as never);

      const result = await osRepo.getData({
        index,
        query,
        sort: [],
        page: 1,
        limit: 100,
      });

      expect(result.total).toBe(100);
    });
  });

  describe('scroll', () => {
    it('scrolling with scrollId succeeds', async () => {
      const scrollId = faker.string.alphanumeric(32);
      const mockData = [{ KEY1: 'VALUE1' }, { KEY2: 'VALUE2' }];

      jest.spyOn(osClient, 'scroll').mockResolvedValue({
        body: {
          hits: {
            hits: mockData.map((data) => ({ _source: data })),
          },
          _scroll_id: scrollId,
        },
      } as never);

      const result = await osRepo.scroll({
        scrollId,
        index: '',
        size: 10,
        query: { bool: { must: [{ term: { status: 'active' } }] } },
        sort: [],
      });

      expect(result.data).toEqual(mockData);
      expect(result.scrollId).toEqual(scrollId);
      expect(osClient.scroll).toHaveBeenCalledWith({
        scroll_id: scrollId,
        scroll: '1m',
      });
    });

    it('scrolling without scrollId performs initial search', async () => {
      const index = faker.number.int().toString();
      const query = { bool: { must: [{ term: { status: 'active' } }] } };
      const sort = ['_id:desc'];
      const size = 10;
      const mockData = [{ KEY1: 'VALUE1' }];

      jest.spyOn(osClient, 'search').mockResolvedValue({
        body: {
          hits: {
            hits: mockData.map((data) => ({ _source: data })),
          },
          _scroll_id: 'new_scroll_id',
        },
      } as never);

      const result = await osRepo.scroll({
        index,
        query,
        sort,
        size,
        scrollId: null,
      });

      expect(result.data).toEqual(mockData);
      expect(result.scrollId).toEqual('new_scroll_id');
      expect(osClient.search).toHaveBeenCalledWith({
        index,
        size,
        sort,
        body: { query },
        scroll: '1m',
      });
    });

    it('scrolling with empty sort adds default sort', async () => {
      const index = faker.number.int().toString();
      const query = { bool: { must: [{ term: { status: 'active' } }] } };
      const sort: string[] = [];

      jest.spyOn(osClient, 'search').mockResolvedValue({
        body: {
          hits: { hits: [] },
          _scroll_id: 'scroll_id',
        },
      } as never);

      await osRepo.scroll({ index, query, sort, size: 10, scrollId: null });

      expect(osClient.search).toHaveBeenCalledWith({
        index,
        size: 10,
        sort: ['_id:desc'],
        body: { query },
        scroll: '1m',
      });
    });
  });

  describe('updateData', () => {
    it('updating data succeeds with valid inputs', async () => {
      const index = faker.number.int().toString();
      const id = faker.number.int().toString();
      const updateData = { KEY1: 'UPDATED_VALUE' };

      jest.spyOn(osClient, 'update').mockResolvedValue({
        body: {
          _id: id,
          result: 'updated',
        },
      } as never);

      await osRepo.updateData({ index, id, data: updateData });

      expect(osClient.update).toHaveBeenCalledWith({
        index,
        id,
        body: {
          doc: updateData,
        },
        refresh: true,
        retry_on_conflict: 5,
      });
    });

    it('updating data handles errors', async () => {
      const index = faker.number.int().toString();
      const id = faker.number.int().toString();
      const updateData = { KEY1: 'UPDATED_VALUE' };
      const error = new Error('Update failed');

      jest.spyOn(osClient, 'update').mockRejectedValue(error as never);

      await expect(
        osRepo.updateData({ index, id, data: updateData }),
      ).rejects.toThrow('Update failed');
    });
  });

  describe('deleteBulkData', () => {
    it('deleting bulk data succeeds with valid ids', async () => {
      const index = faker.number.int().toString();
      const ids = [faker.number.int(), faker.number.int()];

      jest.spyOn(osClient, 'deleteByQuery').mockResolvedValue({
        body: {
          deleted: ids.length,
        },
      } as never);

      await osRepo.deleteBulkData({ index, ids });

      expect(osClient.deleteByQuery).toHaveBeenCalledWith({
        index,
        body: { query: { terms: { _id: ids } } },
        refresh: true,
      });
    });

    it('deleting bulk data with empty ids array', async () => {
      const index = faker.number.int().toString();
      const ids: number[] = [];

      jest.spyOn(osClient, 'deleteByQuery').mockResolvedValue({
        body: {
          deleted: 0,
        },
      } as never);

      await osRepo.deleteBulkData({ index, ids });

      expect(osClient.deleteByQuery).toHaveBeenCalledWith({
        index,
        body: { query: { terms: { _id: ids } } },
        refresh: true,
      });
    });
  });

  describe('deleteIndex', () => {
    it('deleting index succeeds with valid index', async () => {
      const index = faker.number.int().toString();
      const indexName = 'channel_' + index;

      jest.spyOn(osClient.indices, 'delete').mockResolvedValue({
        body: {
          acknowledged: true,
        },
      } as never);

      await osRepo.deleteIndex(index);

      expect(osClient.indices.delete).toHaveBeenCalledWith({
        index: indexName,
      });
    });

    it('deleting index handles errors', async () => {
      const index = faker.number.int().toString();
      const error = new Error('Delete failed');

      jest.spyOn(osClient.indices, 'delete').mockRejectedValue(error as never);

      await expect(osRepo.deleteIndex(index)).rejects.toThrow('Delete failed');
    });
  });

  describe('getTotal', () => {
    it('getting total count succeeds with valid query', async () => {
      const index = faker.number.int().toString();
      const query = { bool: { must: [{ term: { status: 'active' } }] } };

      jest.spyOn(osClient, 'count').mockResolvedValue({
        body: {
          count: 100,
        },
      } as never);

      const result = await osRepo.getTotal(index, query);

      expect(result).toBe(100);
      expect(osClient.count).toHaveBeenCalledWith({
        index,
        body: { query },
      });
    });

    it('getting total count with complex query', async () => {
      const index = faker.number.int().toString();
      const query = {
        bool: {
          must: [
            { term: { status: 'active' } },
            { range: { created_at: { gte: '2023-01-01' } } },
          ],
        },
      };

      jest.spyOn(osClient, 'count').mockResolvedValue({
        body: {
          count: 50,
        },
      } as never);

      const result = await osRepo.getTotal(index, query);

      expect(result).toBe(50);
      expect(osClient.count).toHaveBeenCalledWith({
        index,
        body: { query },
      });
    });

    it('getting total count handles errors', async () => {
      const index = faker.number.int().toString();
      const query = { bool: { must: [{ term: { status: 'active' } }] } };
      const error = new Error('Count failed');

      jest.spyOn(osClient, 'count').mockRejectedValue(error as never);

      await expect(osRepo.getTotal(index, query)).rejects.toThrow(
        'Count failed',
      );
    });
  });

  describe('deleteAllIndexes', () => {
    it('deleting all indexes succeeds', async () => {
      jest.spyOn(osClient.indices, 'delete').mockResolvedValue({
        body: {
          acknowledged: true,
        },
      } as never);

      await osRepo.deleteAllIndexes();

      expect(osClient.indices.delete).toHaveBeenCalledWith({
        index: '_all',
      });
    });

    it('deleting all indexes handles errors', async () => {
      const error = new Error('Delete all failed');

      jest.spyOn(osClient.indices, 'delete').mockRejectedValue(error as never);

      await expect(osRepo.deleteAllIndexes()).rejects.toThrow(
        'Delete all failed',
      );
    });
  });

  describe('createKNNIndex', () => {
    it('positive case', async () => {
      const index = faker.number.int().toString();
      const spaceType = SpaceType.CosineSimil;
      const dimension = 3072;
      const indexName = 'si_' + index.toLowerCase() + '_' + spaceType.toString().toLowerCase();
      jest.spyOn(osClient.indices, 'create');
      jest.spyOn(osClient.indices, 'putAlias');

      await osRepo.createKNNIndex({ index, dimension, spaceType });

      expect(osClient.indices.create).toBeCalledTimes(1);
      expect(osClient.indices.create).toBeCalledWith({
        index: indexName,
        body: {
          settings: {
            index: {
              knn: true,
              'knn.algo_param.ef_search': 100,
            },
          },
          mappings: {
            properties: {
              embedding: {
                type: 'knn_vector',
                dimension: 3072,
                method: {
                  name: 'hnsw',
                  space_type: spaceType,
                  engine: 'nmslib',
                  parameters: {
                    ef_construction: 100,
                    m: 16,
                  },
                },
              },
            },
          }
        },
      });
      expect(osClient.indices.putAlias).toBeCalledTimes(1);
      expect(osClient.indices.putAlias).toBeCalledWith({
        index: indexName,
        name: index,
      });
    });
  })

  describe('getSimilarData', () => {
    return;
  })
});
