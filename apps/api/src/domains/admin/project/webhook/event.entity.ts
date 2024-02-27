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
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Relation,
  RelationId,
} from 'typeorm';

import { CommonEntity } from '@/common/entities';
import { EventStatusEnum, EventTypeEnum } from '../../../../common/enums';
import { ChannelEntity } from '../../channel/channel/channel.entity';
import { WebhookEntity } from './webhook.entity';

@Entity('events')
export class EventEntity extends CommonEntity {
  @Column('enum', {
    enum: EventStatusEnum,
    default: EventStatusEnum.ACTIVE,
  })
  status: EventStatusEnum;

  @Column('enum', { enum: EventTypeEnum })
  type: EventTypeEnum;

  @ManyToOne(() => WebhookEntity, (webhook) => webhook.events, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  webhook: Relation<WebhookEntity>;

  @ManyToMany(() => ChannelEntity, (channel) => channel.events, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  channels: ChannelEntity[];

  @RelationId('channels')
  channelIds: number[] | null;

  static from({ webhookId, status, type, channelIds }) {
    const event = new EventEntity();
    event.status = status;
    event.type = type;
    event.webhook = new WebhookEntity();
    event.webhook.id = webhookId;
    if (channelIds) {
      event.channels = channelIds.map((channelId) => {
        const channel = new ChannelEntity();
        channel.id = channelId;
        return channel;
      });
    }

    return event;
  }
}
