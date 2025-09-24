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
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Client, errors } from '@opensearch-project/opensearch';
import { Indices_PutMapping_Response } from '@opensearch-project/opensearch/api';

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
  private logger = new Logger(OpensearchRepository.name);
  private opensearchClient: Client;
  constructor(@Inject('OPENSEARCH_CLIENT') opensearchClient: Client) {
    this.opensearchClient = opensearchClient;
  }

  async createIndex({ index }: CreateIndexDto) {
    const indexName = 'channel_' + index;
    try {
      const response = await this.opensearchClient.indices.create({
        index: indexName,
        body: {
          settings: {
            index: { max_ngram_diff: 1 },
            analysis: {
              analyzer: {
                ngram_analyzer: {
                  type: 'custom',
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
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (response) {
        this.logger.log(
          `Index created successfully: ${JSON.stringify(response.body, null, 2)}`,
        );
      }
    } catch (error) {
      this.logger.log(`Error creating index: ${error}`);
      if (error?.meta?.body) {
        this.logger.log(
          `OpenSearch error details:${JSON.stringify(error.meta.body, null, 2)}`,
        );
      }
      throw error;
    }
    await this.opensearchClient.indices.putAlias({
      index: indexName,
      name: index,
    });
  }

  async putMappings({ index, mappings }: PutMappingsDto) {
    const { statusCode } = await this.opensearchClient.indices.exists({
      index,
    });
    if (statusCode !== 200) throw new NotFoundException('index is not found');

    let response: Indices_PutMapping_Response;
    try {
      response = await this.opensearchClient.indices.putMapping({
        index,
        body: { properties: mappings },
      });
    } catch (error) {
      this.logger.log(`Error put mapping: ${error}`);
      if (error?.meta?.body) {
        this.logger.log(
          `OpenSearch error details:${JSON.stringify(error.meta.body, null, 2)}`,
        );
      }
      throw error;
    }

    return response;
  }

  async createData({ id, index, data }: CreateDataDto) {
    const indexName = 'channel_' + index;
    const existence = await this.opensearchClient.indices.exists({
      index: indexName,
    });
    if (existence.statusCode !== 200)
      throw new NotFoundException('index is not found');

    const response = await this.opensearchClient.indices.getMapping({
      index: indexName,
    });

    const mappingKeys = Object.keys(
      response.body[indexName].mappings.properties as object,
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

    return { id: body._id as unknown as number };
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
        total:
          typeof body.hits.total === 'number' ?
            body.hits.total
          : (body.hits.total?.value ?? 0),
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

  private convertToScrollData(body) {
    return {
      data: body.hits.hits.map((v) => ({
        ...v._source,
      })) as Record<string, any>[],
      scrollId: body._scroll_id,
    };
  }

  async updateData({ id, index, data }: UpdateDataDto) {
    try {
      await this.opensearchClient.update({
        id,
        index,
        body: { doc: data },
        refresh: true,
        retry_on_conflict: 5,
      });
    } catch (error) {
      this.logger.error(`Error updating data: ${error}`);
      if (error?.meta?.body) {
        this.logger.error(
          `OpenSearch error details: ${JSON.stringify(error.meta.body, null, 2)}`,
        );
      }
      throw error;
    }
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

  async deleteAllIndexes() {
    await this.opensearchClient.indices.delete({ index: '_all' });
  }

  async getTotal(index: string, query: object): Promise<number> {
    const { body } = await this.opensearchClient.count({
      index,
      body: { query },
    });

    return body.count;
  }
}
