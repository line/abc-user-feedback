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
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { ProjectService } from '../project/project.service';
import { ApiKeyEntity } from './api-key.entity';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKeyEntity)
    private readonly repository: Repository<ApiKeyEntity>,
    private readonly projectService: ProjectService,
  ) {}

  @Transactional()
  async create(projectId: number) {
    await this.projectService.findById({ projectId });

    const value = randomBytes(10).toString('hex').toUpperCase();
    const apiKey = ApiKeyEntity.from({ projectId, value });

    return await this.repository.save(apiKey);
  }

  async findAllByProjectId(projectId: number) {
    const apiKeys = await this.repository.find({
      where: { project: { id: projectId } },
      withDeleted: true,
    });

    return apiKeys;
  }

  async findByProjectIdAndValue(projectId: number, value: string) {
    const apiKeys = await this.repository.find({
      where: { project: { id: projectId }, value },
    });

    return apiKeys;
  }

  @Transactional()
  async deleteById(id: number) {
    const apiKey = new ApiKeyEntity();
    apiKey.id = id;
    await this.repository.remove(apiKey);
  }

  @Transactional()
  async softDeleteById(id: number) {
    const apiKey = await this.repository.findOne({
      where: {
        id,
      },
    });
    apiKey.deletedAt = dayjs().toDate();

    await this.repository.save(apiKey);
  }

  @Transactional()
  async recoverById(id: number) {
    const apiKey = await this.repository.findOne({
      where: {
        id,
      },
      withDeleted: true,
    });

    await this.repository.save(Object.assign(apiKey, { deletedAt: null }));
  }
}
