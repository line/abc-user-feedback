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
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';

import { CommonEntity } from '@/common/entities';

import { FieldEntity } from './field.entity';
import { ProjectEntity } from './project.entity';

@Entity('channels')
export class ChannelEntity extends CommonEntity {
  @Column('varchar', { length: 255, unique: true })
  name: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('varchar', { length: 36, nullable: true })
  projectId: string;

  @ManyToOne(() => ProjectEntity, (project) => project.channels, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Relation<ProjectEntity>;

  @OneToMany(() => FieldEntity, (field) => field.channel, {
    cascade: true,
  })
  fields: Relation<FieldEntity>[];

  static from(name: string, description: string, projectId: string) {
    const channel = new ChannelEntity();
    channel.name = name;
    channel.description = description;
    channel.projectId = projectId;

    return channel;
  }
}
