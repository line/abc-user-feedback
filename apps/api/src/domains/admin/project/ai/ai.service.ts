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
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { AIIntegrationsEntity } from './ai-integrations.entity';
import { AIClient } from './ai.client';
import { CreateAIIntegrationsDto } from './dtos/create-ai-integrations.dto';

@Injectable()
export class AIService {
  constructor(
    @InjectRepository(AIIntegrationsEntity)
    private readonly aiIntegrationsRepo: Repository<AIIntegrationsEntity>,
  ) {}

  @Transactional()
  async upsert(dto: CreateAIIntegrationsDto) {
    const existingIntegration = await this.aiIntegrationsRepo.findOne({
      where: {
        project: {
          id: dto.projectId,
        },
      },
    });

    if (!existingIntegration) {
      const newIntegration =
        CreateAIIntegrationsDto.toAIIntegrationsEntity(dto);
      await this.aiIntegrationsRepo.save(newIntegration);
      return newIntegration;
    }

    const updatedIntegration = {
      ...existingIntegration,
      ...dto,
    };
    await this.aiIntegrationsRepo.save(updatedIntegration);
    return updatedIntegration;
  }

  async getModels(projectId: number) {
    const integration = await this.aiIntegrationsRepo.findOne({
      where: {
        project: {
          id: projectId,
        },
      },
    });

    if (!integration) {
      return [];
    }

    const client = new AIClient({
      apiKey: integration.apiKey,
      provider: integration.provider,
    });

    const models = await client.getModelList();

    return models;
  }
}
