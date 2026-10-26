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
import { Column, Entity, ManyToOne, Relation } from 'typeorm';

import { CommonEntity } from '@/common/entities';
import { ProjectEntity } from '../project/project.entity';
import { getApiKeyPrefix, hashApiKey } from './api-key.util';

@Entity('api_keys')
export class ApiKeyEntity extends CommonEntity {
  // SHA-256 hex digest of the raw key; the raw key itself is never stored.
  @Column('varchar', { length: 64, unique: true })
  hash: string;

  @Column('varchar', { length: 8 })
  prefix: string;

  @Column('datetime', { nullable: true })
  expiresAt: Date | null;

  @ManyToOne(() => ProjectEntity, (project) => project.apiKeys, {
    onDelete: 'CASCADE',
  })
  project: Relation<ProjectEntity>;

  static from({
    projectId,
    value,
    expiresAt,
    createdAt,
    deletedAt,
  }: {
    projectId: number;
    value: string;
    expiresAt?: Date | null;
    createdAt?: Date;
    deletedAt?: Date;
  }) {
    const apiKey = new ApiKeyEntity();
    apiKey.project = new ProjectEntity();
    apiKey.project.id = projectId;
    apiKey.hash = hashApiKey(value);
    apiKey.prefix = getApiKeyPrefix(value);
    apiKey.expiresAt = expiresAt ?? null;
    if (createdAt) apiKey.createdAt = createdAt;
    if (deletedAt) apiKey.deletedAt = deletedAt;

    return apiKey;
  }
}
