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

  private async validateEvent(event: EventDto) {
    if (
      [EventTypeEnum.FEEDBACK_CREATION, EventTypeEnum.ISSUE_ADDITION].includes(
        event.type,
      )
    ) {
      if (event.channelIds.length > 0) {
        const channels = await this.channelRepo.findBy({
          id: In(event.channelIds),
        });
        return channels.length === event.channelIds.length;
      } else {
        return true;
      }
    } else if (
      [
        EventTypeEnum.ISSUE_CREATION,
        EventTypeEnum.ISSUE_STATUS_CHANGE,
      ].includes(event.type)
    ) {
      return event.channelIds.length === 0;
    }
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

    const newWebhook = WebhookEntity.from({
      projectId: dto.projectId,
      name: dto.name,
      url: dto.url,
      status: dto.status,
    });

    const savedWebhook = await this.repository.save(newWebhook);

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
        webhookId: savedWebhook.id,
        status: event.status,
        type: event.type,
        channelIds: event.channelIds,
      }),
    );
    const savedEvents = await this.eventRepo.save(events);
    savedWebhook.events = savedEvents;

    return savedWebhook;
  }

  async findById(webhookId: number) {
    const webhook = await this.repository.find({
      where: { id: webhookId },
      relations: {
        events: true,
      },
    });

    return webhook;
  }

  async findByProjectId(projectId: number) {
    const webhooks = await this.repository.find({
      where: { project: { id: projectId } },
      relations: { events: true },
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
