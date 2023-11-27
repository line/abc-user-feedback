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
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from 'typeorm';

import { ChannelEntity } from '../../channel/channel/channel.entity';

@Entity('feedback_statistics')
@Unique('channel-date-unique', ['channel', 'date'])
export class FeedbackStatisticsEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('date')
  date: Date;

  @Column('int', { default: 0 })
  count: number;

  @ManyToOne(() => ChannelEntity, (channel) => channel.fields, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  channel: Relation<ChannelEntity>;

  static from({
    date,
    count,
    channelId,
  }: {
    date: Date;
    count: number;
    channelId: number;
  }) {
    const feedbackStats = new FeedbackStatisticsEntity();
    feedbackStats.channel = new ChannelEntity();
    feedbackStats.channel.id = channelId;
    feedbackStats.date = date;
    feedbackStats.count = count;

    return feedbackStats;
  }
}
