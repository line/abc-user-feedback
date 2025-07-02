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
import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';

import { CommonEntity } from '@/common/entities';
import { ChannelEntity } from '../../channel/channel/channel.entity';
import { FieldEntity } from '../../channel/field/field.entity';

@Entity('ai_issue_templates')
export class AIIssueTemplatesEntity extends CommonEntity {
  @ManyToOne(() => ChannelEntity, (channel) => channel.aiIssueTemplates, {
    onDelete: 'CASCADE',
  })
  channel: Relation<ChannelEntity>;

  @Column('json', { nullable: false, default: [] })
  targetFieldKeys: string[];

  @Column('varchar')
  prompt: string;

  @Column('tinyint', { default: 1 })
  isEnabled: boolean;

  @Column('varchar')
  model: string | null;

  @Column('float', { default: 0.7 })
  temperature: number;

  @Column('float', { default: 1.0 })
  linkExistingIssues: number;

  @Column('int', { default: 3 })
  linkIssueFeedbacks: number;

  @OneToMany(() => FieldEntity, (field) => field.aiFieldTemplate, {
    nullable: true,
    cascade: true,
  })
  fields: Relation<FieldEntity>[];

  static from({
    channelId,
    targetFieldKeys,
    prompt,
    isEnabled,
    model,
    temperature,
    linkExistingIssues,
    linkIssueFeedbacks,
  }: {
    channelId: number;
    targetFieldKeys: string[];
    prompt: string;
    isEnabled: boolean;
    model: string | null;
    temperature: number;
    linkExistingIssues: number;
    linkIssueFeedbacks: number;
  }) {
    const aiIssueTemplate = new AIIssueTemplatesEntity();

    aiIssueTemplate.channel = new ChannelEntity();
    aiIssueTemplate.channel.id = channelId;
    aiIssueTemplate.targetFieldKeys = targetFieldKeys;
    aiIssueTemplate.prompt = prompt;
    aiIssueTemplate.isEnabled = isEnabled;
    aiIssueTemplate.model = model;
    aiIssueTemplate.temperature = temperature;
    aiIssueTemplate.linkExistingIssues = linkExistingIssues;
    aiIssueTemplate.linkIssueFeedbacks = linkIssueFeedbacks;

    return aiIssueTemplate;
  }
}
