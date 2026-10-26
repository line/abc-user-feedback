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
import { randomBytes } from 'crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { ProjectNotFoundException } from '../project/exceptions';
import { ProjectEntity } from '../project/project.entity';
import { ApiKeyEntity } from './api-key.entity';
import { hashApiKey } from './api-key.util';
import { CreateApiKeyDto } from './dtos';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKeyEntity)
    private readonly repository: Repository<ApiKeyEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepo: Repository<ProjectEntity>,
  ) {}

  private async validateBeforeCreation(dto: CreateApiKeyDto) {
    if (!dto.value) {
      dto.value = randomBytes(10).toString('hex').toUpperCase();
    }
    const { projectId, value } = dto;
    if (value.length !== 20)
      throw new BadRequestException('Invalid Api Key value');

    const project = await this.projectRepo.findOneBy({ id: projectId });
    if (!project) throw new ProjectNotFoundException();

    const apiKey = await this.repository.findOneBy({ hash: hashApiKey(value) });
    if (apiKey) throw new BadRequestException('Api Key already exists');
  }

  /**
   * Returns the raw key alongside the saved entity. This is the only time the
   * raw key is available; only its hash is persisted.
   */
  @Transactional()
  async create(dto: CreateApiKeyDto) {
    if (dto.expiresAt && dto.expiresAt.getTime() <= Date.now()) {
      throw new BadRequestException('expiresAt must be in the future');
    }
    await this.validateBeforeCreation(dto);
    const { projectId, value, expiresAt } = dto;

    const newApiKey = ApiKeyEntity.from({ projectId, value, expiresAt });
    const savedApiKey = await this.repository.save(newApiKey);

    return { ...savedApiKey, value };
  }

  @Transactional()
  async createMany(dtos: CreateApiKeyDto[]) {
    for (const dto of dtos) {
      await this.validateBeforeCreation(dto);
    }

    const apiKeys = dtos.map(
      ({ projectId, value, expiresAt, createdAt, deletedAt }) =>
        ApiKeyEntity.from({
          projectId,
          value,
          expiresAt,
          createdAt,
          deletedAt,
        }),
    );

    return await this.repository.save(apiKeys);
  }

  async findAllByProjectId(projectId: number) {
    const apiKeys = await this.repository.find({
      where: { project: { id: projectId } },
      withDeleted: true,
    });

    return apiKeys;
  }

  /**
   * Finds a key of the project by its raw value. Soft-deleted keys are excluded
   * by TypeORM, and expired keys are filtered out here.
   */
  async findUsableByProjectIdAndValue(projectId: number, value: string) {
    const apiKey = await this.repository.findOne({
      where: { project: { id: projectId }, hash: hashApiKey(value) },
    });
    if (!apiKey) return null;
    if (apiKey.expiresAt && apiKey.expiresAt.getTime() <= Date.now()) {
      return null;
    }

    return apiKey;
  }

  @Transactional()
  async deleteById(id: number) {
    const apiKey = new ApiKeyEntity();
    apiKey.id = id;
    await this.repository.remove(apiKey);
  }

  @Transactional()
  async softDeleteById(id: number) {
    const apiKey =
      (await this.repository.findOne({
        where: {
          id,
        },
      })) ?? new ApiKeyEntity();

    await this.repository.save(
      Object.assign(apiKey, { deletedAt: DateTime.utc().toJSDate() }),
    );
  }

  @Transactional()
  async recoverById(id: number) {
    const apiKey =
      (await this.repository.findOne({
        where: {
          id,
        },
        withDeleted: true,
      })) ?? new ApiKeyEntity();

    await this.repository.save(Object.assign(apiKey, { deletedAt: null }));
  }
}
