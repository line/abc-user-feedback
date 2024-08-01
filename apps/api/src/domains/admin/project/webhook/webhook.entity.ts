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
import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';

import { CommonEntity } from '@/common/entities';
import { WebhookStatusEnum } from '../../../../common/enums';
import { ProjectEntity } from '../project/project.entity';
import { EventEntity } from './event.entity';

@Entity('webhooks')
export class WebhookEntity extends CommonEntity {
  @Column('varchar')
  name: string;

  @Column('varchar')
  url: string;

  @Column('varchar')
  token: string | null;

  @Column('enum', {
    enum: WebhookStatusEnum,
    default: WebhookStatusEnum.ACTIVE,
  })
  status: WebhookStatusEnum;

  @ManyToOne(() => ProjectEntity, (project) => project.webhooks, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  project: Relation<ProjectEntity>;

  @OneToMany(() => EventEntity, (event) => event.webhook, {
    cascade: true,
  })
  events: Relation<EventEntity>[];

  static from({
    projectId,
    name,
    url,
    token,
    status,
    events,
  }: {
    projectId: number;
    name: string;
    url: string;
    token: string | null;
    status: WebhookStatusEnum;
    events: EventEntity[];
  }): WebhookEntity {
    const webhook = new WebhookEntity();
    webhook.project = new ProjectEntity();
    webhook.project.id = projectId;
    webhook.name = name;
    webhook.url = url;
    webhook.token = token;
    webhook.status = status;
    webhook.events = events;

    return webhook;
  }
}
