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
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Relation,
} from 'typeorm';

import { CommonEntity } from '@/common/entities';

import { ChannelEntity } from '../channel/channel/channel.entity';
import { IssueEntity } from '../project/issue/issue.entity';

@Entity('feedbacks')
@Index(['createdAt'])
export class FeedbackEntity extends CommonEntity {
  @Column({ type: 'json' })
  rawData: object;

  @Column({ type: 'json', nullable: true })
  additionalData: object;

  @ManyToOne(() => ChannelEntity, (channel) => channel.feedbacks, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  channel: Relation<ChannelEntity>;

  @ManyToMany(() => IssueEntity, (issue) => issue.feedbacks, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  issues: IssueEntity[];
}
