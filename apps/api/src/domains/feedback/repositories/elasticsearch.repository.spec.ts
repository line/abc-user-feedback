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
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Test } from '@nestjs/testing';
import dayjs from 'dayjs';

import { TestConfig, TestElasticsearchConfigModule } from '@/utils/test-utils';

import { CreateDataDto, PutMappingsDto } from './dtos/elasticsearchs';
import { ElasticsearchRepository } from './elasticsearch.repository';

describe('Elasticsearch Repository Test suite', () => {
  let esRepo: ElasticsearchRepository;
  let esService: ElasticsearchService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig, TestElasticsearchConfigModule],
      providers: [ElasticsearchRepository],
    }).compile();
    esRepo = module.get(ElasticsearchRepository);
    esService = module.get(ElasticsearchService);
  });
  afterEach(() => {
    esService.connectionPool.connections.map((v) => v.close());
  });

  describe('create index', () => {
    it('positive case', async () => {
      const index = faker.datatype.uuid();
      await esRepo.createIndex({ index });
      const { body } = await esService.indices.get({ index });
      expect(body[index]).toBeDefined();
    });
  });

  describe('put mappings', () => {
    let index: string;

    beforeAll(async () => {
      index = faker.datatype.uuid();
      await esService.indices.create({ index });
    });

    it('create', async () => {
      const dto = new PutMappingsDto();
      dto.index = index;
      dto.mappings = { email: { type: 'keyword' } };
      await esRepo.putMappings(dto);

      const results1 = await esService.indices.get({ index });
      expect(results1.body[index].mappings.properties).toMatchObject(
        dto.mappings,
      );
    });
    it('replace', async () => {
      const original = await esService.indices.get({ index });
      const originalMapping = original.body[index].mappings.properties;

      const dto2 = new PutMappingsDto();
      dto2.index = index;
      dto2.mappings = {
        ...originalMapping,
        email2: { type: 'keyword' },
      };
      await esRepo.putMappings(dto2);

      const results2 = await esService.indices.get({ index });
      expect(results2.body[index].mappings.properties).toMatchObject(
        dto2.mappings,
      );
    });
    it('add', async () => {
      const original = await esService.indices.get({ index });
      const originalMapping = original.body[index].mappings.properties;

      const dto3 = new PutMappingsDto();
      dto3.index = index;
      dto3.mappings = {
        email3: { type: 'keyword' },
      };
      await esRepo.putMappings(dto3);

      const results3 = await esService.indices.get({ index });
      expect(results3.body[index].mappings.properties).toMatchObject(
        Object.assign(dto3.mappings, originalMapping),
      );
    });
  });

  describe('create data', () => {
    it('positive case', async () => {
      const index = faker.datatype.uuid();

      await esService.indices.create({ index });
      await esService.indices.putMapping({
        index,
        body: {
          properties: { email: { type: 'keyword' }, text: { type: 'text' } },
        },
      });

      const dto = new CreateDataDto();
      dto.index = index;
      dto.data = {
        email: faker.datatype.string(),
        text: faker.datatype.string(),
      };

      const { id } = await esRepo.createData(dto);

      const {
        body: { _source },
      } = await esService.get({ id, index });

      expect(_source.email).toEqual(dto.data.email);
      expect(_source.text).toEqual(dto.data.text);

      // const search = await esService.search({
      //   index,
      //   body: { query: { match_all: {} } },
      // });
      // expect(search.body.hits.total.value).toEqual(1);
    });
  });

  describe('get data', () => {
    it('', async () => {
      const index = faker.datatype.uuid();
      await esService.indices.create({ index });

      const length = faker.datatype.number({ min: 1, max: 100 });

      const dataset = Array.from({ length }).map(() => ({
        text: faker.datatype.string(),
        number: faker.datatype.number(),
        boolean: true,
        createdAt: dayjs().toDate(),
      }));
      const body = dataset.flatMap((doc) => [
        { index: { _index: index } },
        doc,
      ]);

      await esService.bulk({ refresh: true, body });

      const {
        body: { count },
      } = await esService.count({ index });
      expect(count).toEqual(length);

      const res = await esRepo.getData({
        index,
        limit: 100,
        page: 1,
        query: {
          range: {
            createdAt: {
              gte: dayjs().subtract(1, 'days').toISOString(),
              lte: dayjs().add(1, 'days').toISOString(),
            },
          },
        },
      });

      expect(res).toHaveLength(length);
    });
  });

  describe('update data', () => {
    it('', async () => {
      const index = faker.datatype.uuid();
      await esService.indices.create({ index });

      const { body } = await esService.index({
        index,
        body: { test: faker.datatype.string() },
        refresh: true,
      });
      const id = body._id;

      const targetValue = faker.datatype.string();
      await esRepo.updateData({ index, id, key: 'test', value: targetValue });

      const result = await esService.get({ id, index });
      expect(result.body._source.test).toEqual(targetValue);
    });
  });
});
