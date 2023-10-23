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
  ManyToOne,
  OneToMany,
  Relation,
  Unique,
} from 'typeorm';

import { CommonEntity } from '@/common/entities';
import { FeedbackEntity } from '../../feedback/feedback.entity';
import { ProjectEntity } from '../../project/project/project.entity';
import { FieldEntity } from '../field/field.entity';

@Entity('channels')
@Index(['name', 'createdAt'])
@Unique('project-name-unique', ['name', 'project'])
export class ChannelEntity extends CommonEntity {
  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { nullable: true })
  description: string;

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

  static from(name: string, description: string, projectId: number) {
    const channel = new ChannelEntity();
    channel.name = name;
    if (description) {
      channel.description = description;
    }
    channel.project = new ProjectEntity();
    channel.project.id = projectId;

    return channel;
  }
}
