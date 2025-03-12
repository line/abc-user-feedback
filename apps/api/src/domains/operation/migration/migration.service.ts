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
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '@opensearch-project/opensearch';
import { DateTime } from 'luxon';
import { Repository } from 'typeorm';

import { OpensearchRepository } from '@/common/repositories';
import { ChannelEntity } from '../../admin/channel/channel/channel.entity';
import { FieldService } from '../../admin/channel/field/field.service';
import { FeedbackEntity } from '../../admin/feedback/feedback.entity';

@Injectable()
export class MigrationService {
  private opensearchClient: Client;
  private logger = new Logger(MigrationService.name);
  constructor(
    @InjectRepository(ChannelEntity)
    private readonly channelRepository: Repository<ChannelEntity>,
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>,
    private readonly fieldService: FieldService,
    private readonly osRepository: OpensearchRepository,
    @Inject('OPENSEARCH_CLIENT') opensearchClient: Client,
  ) {
    this.opensearchClient = opensearchClient;
  }
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      chunks.push(chunk);
    }
    return chunks;
  }

  private async migrateFeedbacks(index: number) {
    const feedbacks = await this.feedbackRepository.find({
      where: {
        channel: {
          id: index,
        },
      },
    });

    const documents = feedbacks.map((feedback) => {
      return {
        id: feedback.id,
        ...feedback.data,
        createdAt: DateTime.fromJSDate(feedback.createdAt).toFormat(
          'yyyy-MM-dd HH:mm:ssZZ',
        ),
        updatedAt: DateTime.fromJSDate(feedback.updatedAt).toFormat(
          'yyyy-MM-dd HH:mm:ssZZ',
        ),
      };
    });
    this.logger.log('documents.length: ' + documents.length);

    if (documents.length > 0) {
      const chunks = this.chunkArray(documents, 1000);
      for (const chunk of chunks) {
        const res = await this.opensearchClient.bulk({
          refresh: true,
          body: chunk.flatMap((doc) => {
            const _id = doc.id;
            return [{ index: { _index: 'channel_' + index, _id } }, doc];
          }),
        });

        if (res.body.errors) {
          this.logger.error('migration error', index);
          this.logger.error(res.body);
        }
      }
    }

    this.logger.log('migration done');
  }

  async migrateToES() {
    this.logger.log('migration check');
    const channels = await this.channelRepository.find();

    for (const channel of channels) {
      const channelId = channel.id;
      const { body, statusCode } = await this.opensearchClient.indices.exists({
        index: 'channel_' + channelId.toString(),
      });
      this.logger.log({ channel });
      this.logger.log({ body });

      if (statusCode !== 200) {
        this.logger.log(`migration for ${channelId} started`);
        const fields = await this.fieldService.findByChannelId({ channelId });
        await this.osRepository.createIndex({ index: channelId.toString() });
        this.logger.log('index created');
        await this.osRepository.putMappings({
          index: channelId.toString(),
          mappings: this.fieldService.fieldsToMapping(fields),
        });
        this.logger.log('mappings put');
        await this.migrateFeedbacks(channelId);
      }
    }
  }

  async migrateToESByChannelId(channelId: number) {
    this.logger.log(`migration for ${channelId} started`);
    await this.migrateFeedbacks(channelId);
  }
}
