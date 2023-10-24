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
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Client, errors } from '@opensearch-project/opensearch';

import type {
  CreateDataDto,
  CreateIndexDto,
  DeleteBulkDataDto,
  GetDataDto,
  PutMappingsDto,
  ScrollDto,
  UpdateDataDto,
} from './dtos';
import { LargeWindowException } from './large-window.exception';

@Injectable()
export class OpensearchRepository {
  private opensearchClient: Client;
  constructor(@Inject('OPENSEARCH_CLIENT') opensearchClient: Client) {
    this.opensearchClient = opensearchClient;
  }

  async createIndex({ index }: CreateIndexDto) {
    const indexName = 'channel_' + index;
    await this.opensearchClient.indices.create({
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
    await this.opensearchClient.indices.putAlias({
      index: indexName,
      name: index,
    });
  }

  async putMappings({ index, mappings }: PutMappingsDto) {
    const { body } = await this.opensearchClient.indices.exists({ index });
    if (!body) throw new NotFoundException('index is not found');

    return await this.opensearchClient.indices.putMapping({
      index,
      body: { properties: mappings },
    });
  }

  async createData({ id, index, data }: CreateDataDto) {
    const indexName = 'channel_' + index;
    const existence = await this.opensearchClient.indices.exists({
      index: indexName,
    });
    if (!existence.body) throw new NotFoundException('index is not found');

    const response = await this.opensearchClient.indices.getMapping({
      index: indexName,
    });

    const mappingKeys = Object.keys(
      response.body[indexName].mappings.properties,
    );
    const dataKeys = Object.keys(data);
    if (!dataKeys.every((v) => mappingKeys.includes(v))) {
      throw new InternalServerErrorException('error!!!');
    }

    const { body } = await this.opensearchClient.index({
      id,
      index: indexName,
      body: data,
      refresh: true,
    });

    return { id: body._id };
  }

  async getData(dto: GetDataDto) {
    const { index, limit = 100, page = 1, query, sort } = dto;

    if (sort.length === 0) {
      sort.push('_id:desc');
    }
    try {
      const { body } = await this.opensearchClient.search({
        index,
        from: (page - 1) * limit,
        size: limit,
        sort,
        body: { query },
      });

      return {
        items: body.hits.hits.map((v) => ({
          ...v._source,
        })) as Record<string, any>[],
        total: body.hits.total.value,
      };
    } catch (error) {
      if (error instanceof errors.OpenSearchClientError) {
        if (error.message.includes('Result window is too large')) {
          throw new LargeWindowException(error.message);
        }
      }
      throw error;
    }
  }

  async scroll(dto: ScrollDto) {
    const { index, size, scrollId, query, sort } = dto;

    if (sort.length === 0) sort.push('_id:desc');

    if (scrollId) {
      const { body } = await this.opensearchClient.scroll({
        scroll_id: scrollId,
        scroll: '1m',
      });
      return this.convertToScrollData(body);
    }

    const { body } = await this.opensearchClient.search({
      index,
      size,
      sort,
      body: { query },
      scroll: '1m',
    });
    return this.convertToScrollData(body);
  }

  private convertToScrollData(body: Record<string, any>) {
    return {
      data: body.hits.hits.map((v) => ({
        ...v._source,
      })) as Record<string, any>[],
      scrollId: body._scroll_id,
    };
  }

  async updateData({ id, index, data }: UpdateDataDto) {
    await this.opensearchClient.update({
      id,
      index,
      body: { doc: data },
      refresh: true,
    });
  }

  async deleteBulkData({ ids, index }: DeleteBulkDataDto) {
    await this.opensearchClient.deleteByQuery({
      index,
      body: { query: { terms: { _id: ids } } },
      refresh: true,
    });
  }

  async deleteIndex(index: string) {
    await this.opensearchClient.indices.delete({ index: 'channel_' + index });
  }

  async getTotal(index: string, query: any) {
    const { body } = await this.opensearchClient.count({
      index,
      body: { query },
    });

    return body.count;
  }
}
