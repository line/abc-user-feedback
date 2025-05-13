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
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { AIIntegrationsEntity } from './ai-integrations.entity';
import { CreateAIIntegrationsDto } from './dtos/create-ai-integrations.dto';
import { UpdateAIIntegrationsDto } from './dtos/update-ai-integrations.dto';

@Injectable()
export class AIService {
  constructor(
    @InjectRepository(AIIntegrationsEntity)
    private readonly aiIntegrationsRepo: Repository<AIIntegrationsEntity>,
  ) {}

  @Transactional()
  async create(dto: CreateAIIntegrationsDto) {
    const aiIntegration = CreateAIIntegrationsDto.toAIIntegrationsEntity(dto);

    const savedAiIntegration =
      await this.aiIntegrationsRepo.save(aiIntegration);

    return savedAiIntegration;
  }

  @Transactional()
  async update(dto: UpdateAIIntegrationsDto) {
    const existingIntegration = await this.aiIntegrationsRepo.findOne({
      where: {
        project: {
          id: dto.projectId,
        },
      },
    });

    if (!existingIntegration) {
      throw new BadRequestException('AI Integration not found');
    }

    const updatedIntegration = {
      ...existingIntegration,
      ...dto,
    };
    await this.aiIntegrationsRepo.save(updatedIntegration);
    return updatedIntegration;
  }
}
