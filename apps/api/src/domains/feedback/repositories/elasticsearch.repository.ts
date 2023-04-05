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
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import {
  CreateDataDto,
  CreateIndexDto,
  GetDataDto,
  PutMappingsDto,
  UpdateDataDto,
} from './dtos/elasticsearchs';

@Injectable()
export class ElasticsearchRepository {
  constructor(private readonly esService: ElasticsearchService) {}

  async createIndex({ index }: CreateIndexDto) {
    return await this.esService.indices.create({
      index,
      body: {
        settings: {
          index: {
            max_ngram_diff: 9,
          },
          analysis: {
            analyzer: {
              ngram_analyzer: {
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
  }

  async putMappings({ index, mappings }: PutMappingsDto) {
    const { body } = await this.esService.indices.exists({ index });
    if (!body) throw new NotFoundException('index is not found');

    return await this.esService.indices.putMapping({
      index,
      body: { properties: mappings },
    });
  }

  async createData({ index, data }: CreateDataDto) {
    const response = await this.esService.indices.getMapping({ index });
    const mappingKeys = Object.keys(response.body[index].mappings.properties);
    const dataKeys = Object.keys(data);
    if (!dataKeys.every((v) => mappingKeys.includes(v))) {
      throw new InternalServerErrorException('error!!!');
    }

    const { body } = await this.esService.index({
      index,
      body: data,
      refresh: true,
    });
    return { id: body._id };
  }

  async getData(dto: GetDataDto) {
    const { index, limit = 100, page = 1, query } = dto;

    const { body } = await this.esService.search({
      index,
      from: (page - 1) * limit,
      size: limit,
      sort: ['_id:desc'],
      body: { query },
    });
    return {
      items: body.hits.hits.map((v) => ({
        id: v._id,
        ...v._source,
      })) as Record<string, any>[],
      total: body.hits.total.value,
    };
  }

  async updateData({ id, index, key, value }: UpdateDataDto) {
    await this.esService.update({
      id,
      index,
      body: { doc: { [key]: value } },
      refresh: true,
    });
  }
}
