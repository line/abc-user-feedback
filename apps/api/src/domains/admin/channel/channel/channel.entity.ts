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
import {
  Column,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Relation,
  Unique,
} from 'typeorm';

import { CommonEntity } from '@/common/entities';
import { FeedbackStatisticsEntity } from '@/domains/admin/statistics/feedback/feedback-statistics.entity';
import { FeedbackEntity } from '../../feedback/feedback.entity';
import { AIIssueTemplatesEntity } from '../../project/ai/ai-issue-templates.entity';
import { ProjectEntity } from '../../project/project/project.entity';
import { EventEntity } from '../../project/webhook/event.entity';
import { FieldEntity } from '../field/field.entity';

export interface ImageConfig {
  accessKeyId: string;
  secretAccessKey: string;
  endpoint: string;
  region: string;
  bucket: string;
  domainWhiteList: string[];
}

@Entity('channels')
@Index(['name', 'createdAt'])
@Unique('project-name-unique', ['name', 'project'])
export class ChannelEntity extends CommonEntity {
  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { nullable: true })
  description: string | null;

  @Column({ type: 'json', nullable: true })
  imageConfig: ImageConfig | null;

  @Column('int', { default: 365 })
  feedbackSearchMaxDays: number;

  @ManyToOne(() => ProjectEntity, (project) => project.channels, {
    onDelete: 'CASCADE',
  })
  project: Relation<ProjectEntity>;

  @OneToMany(() => FieldEntity, (field) => field.channel, {
    cascade: true,
  })
  fields: Relation<FieldEntity>[];

  @OneToMany(() => FeedbackEntity, (feedback) => feedback.channel, {
    cascade: true,
  })
  feedbacks: Relation<FeedbackEntity>[];

  @OneToMany(
    () => AIIssueTemplatesEntity,
    (aiIssueTemplates) => aiIssueTemplates.channel,
    {
      cascade: true,
    },
  )
  aiIssueTemplates: Relation<AIIssueTemplatesEntity>[];

  @OneToMany(
    () => FeedbackStatisticsEntity,
    (feedbackStats) => feedbackStats.channel,
    {
      cascade: true,
    },
  )
  feedbackStats: Relation<FeedbackStatisticsEntity>[];

  @ManyToMany(() => EventEntity, (event) => event.channels, {
    onDelete: 'CASCADE',
  })
  events: EventEntity[];

  static from(
    name: string,
    description: string | null,
    projectId: number,
    imageConfig: ImageConfig | null,
    feedbackSearchMaxDays: number,
  ) {
    const channel = new ChannelEntity();
    channel.name = name;
    if (description) {
      channel.description = description;
    }
    if (imageConfig) {
      channel.imageConfig = imageConfig;
    }
    channel.project = new ProjectEntity();
    channel.project.id = projectId;
    channel.feedbackSearchMaxDays = feedbackSearchMaxDays;

    return channel;
  }
}
