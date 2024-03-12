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
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { EventTypeEnum } from '@/common/enums';
import { ChannelEntity } from '../../channel/channel/channel.entity';
import type { EventDto } from './dtos';
import { CreateWebhookDto, UpdateWebhookDto } from './dtos';
import { EventEntity } from './event.entity';
import { WebhookAlreadyExistsException } from './exceptions';
import { WebhookEntity } from './webhook.entity';

@Injectable()
export class WebhookService {
  constructor(
    @InjectRepository(WebhookEntity)
    private readonly repository: Repository<WebhookEntity>,
    @InjectRepository(EventEntity)
    private readonly eventRepo: Repository<EventEntity>,
    @InjectRepository(ChannelEntity)
    private readonly channelRepo: Repository<ChannelEntity>,
  ) {}

  private async validateEvent(event: EventDto): Promise<boolean> {
    const requiresChannelIds = [
      EventTypeEnum.FEEDBACK_CREATION,
      EventTypeEnum.ISSUE_ADDITION,
    ].includes(event.type);

    if (
      requiresChannelIds &&
      (!event.channelIds || event.channelIds.length === 0)
    ) {
      return false;
    }

    if (requiresChannelIds) {
      const channels = await this.channelRepo.findBy({
        id: In(event.channelIds),
      });
      return channels.length === event.channelIds.length;
    } else if (
      [
        EventTypeEnum.ISSUE_CREATION,
        EventTypeEnum.ISSUE_STATUS_CHANGE,
      ].includes(event.type)
    ) {
      return !event.channelIds || event.channelIds.length === 0;
    }

    return false;
  }

  @Transactional()
  async create(dto: CreateWebhookDto) {
    const webhookWithSameName = await this.repository.findOne({
      where: { project: { id: dto.projectId }, name: dto.name },
    });
    if (webhookWithSameName) throw new WebhookAlreadyExistsException();
    const webhookWithSameURL = await this.repository.findOne({
      where: { project: { id: dto.projectId }, url: dto.url },
    });
    if (webhookWithSameURL) throw new WebhookAlreadyExistsException();

    const events = (
      await Promise.all(
        dto.events.map(async (event) => {
          if (!(await this.validateEvent(event)))
            throw new BadRequestException('invalid webhook event and channels');
          return event;
        }),
      )
    ).map((event) =>
      EventEntity.from({
        status: event.status,
        type: event.type,
        channelIds: event.channelIds,
      }),
    );

    const newWebhook = WebhookEntity.from({
      projectId: dto.projectId,
      name: dto.name,
      url: dto.url,
      status: dto.status,
      events,
    });

    return await this.repository.save(newWebhook);
  }

  async findById(webhookId: number) {
    const webhook = await this.repository.find({
      where: { id: webhookId },
      relations: { events: { channels: true } },
    });

    return webhook;
  }

  async findByProjectId(projectId: number) {
    const webhooks = await this.repository.find({
      where: { project: { id: projectId } },
      relations: { events: { channels: true } },
    });

    return webhooks;
  }

  @Transactional()
  async update(dto: UpdateWebhookDto) {
    const webhook = await this.repository.findOne({
      where: { id: dto.id },
      relations: ['events'],
    });

    if (
      await this.repository.findOne({
        where: {
          name: dto.name,
          project: { id: dto.projectId },
          id: Not(dto.id),
        },
      })
    )
      throw new WebhookAlreadyExistsException();
    if (
      await this.repository.findOne({
        where: {
          url: dto.url,
          project: { id: dto.projectId },
          id: Not(dto.id),
        },
      })
    )
      throw new WebhookAlreadyExistsException();

    webhook.name = dto.name;
    webhook.url = dto.url;
    webhook.status = dto.status;
    webhook.events = (
      await Promise.all(
        dto.events.map(async (event) => {
          if (!(await this.validateEvent(event)))
            throw new BadRequestException('invalid webhook event and channels');
          return event;
        }),
      )
    ).map((event) =>
      EventEntity.from({
        webhookId: webhook.id,
        status: event.status,
        type: event.type,
        channelIds: event.channelIds,
      }),
    );

    return this.repository.save(webhook);
  }

  @Transactional()
  async delete(webhookId) {
    const webhook = await this.repository.findOne({
      where: { id: webhookId },
    });

    await this.repository.remove(webhook);
  }
}
