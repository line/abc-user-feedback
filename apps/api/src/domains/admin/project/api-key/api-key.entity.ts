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
import { Column, Entity, ManyToOne, Relation } from 'typeorm';

import { CommonEntity } from '@/common/entities';
import { ProjectEntity } from '../project/project.entity';

@Entity('api_keys')
export class ApiKeyEntity extends CommonEntity {
  @Column('varchar', { length: 255, unique: true })
  value: string;

  @ManyToOne(() => ProjectEntity, (project) => project.apiKeys, {
    onDelete: 'CASCADE',
  })
  project: Relation<ProjectEntity>;

  static from({
    projectId,
    value,
    createdAt,
    deletedAt,
  }: {
    projectId: number;
    value: string;
    createdAt?: Date;
    deletedAt?: Date;
  }) {
    const apiKey = new ApiKeyEntity();
    apiKey.project = new ProjectEntity();
    apiKey.project.id = projectId;
    apiKey.value = value;
    if (createdAt) apiKey.createdAt = createdAt;
    if (deletedAt) apiKey.deletedAt = deletedAt;

    return apiKey;
  }
}
