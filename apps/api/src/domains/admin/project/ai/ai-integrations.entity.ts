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
import { Column, Entity, JoinColumn, OneToOne, Relation } from 'typeorm';

import { CommonEntity } from '@/common/entities';
import { AIProvidersEnum } from '@/common/enums/ai-providers.enum';
import { ProjectEntity } from '../project/project.entity';

@Entity('ai_integrations')
export class AIIntegrationsEntity extends CommonEntity {
  @Column('enum', { enum: AIProvidersEnum })
  provider: AIProvidersEnum;

  @Column('varchar')
  model: string;

  @Column('varchar')
  apiKey: string;

  @Column('varchar', { nullable: true, default: null })
  endpointUrl: string | null;

  @OneToOne(() => ProjectEntity, (project) => project.aiIntegrations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  project: Relation<ProjectEntity>;

  static from({
    provider,
    model,
    apiKey,
    endpointUrl,
    projectId,
  }: {
    provider: AIProvidersEnum;
    model: string;
    apiKey: string;
    endpointUrl: string | null;
    projectId: number;
  }) {
    const aiIntegrations = new AIIntegrationsEntity();

    aiIntegrations.provider = provider;
    aiIntegrations.model = model;
    aiIntegrations.apiKey = apiKey;
    if (endpointUrl) {
      aiIntegrations.endpointUrl = endpointUrl;
    }
    aiIntegrations.project = new ProjectEntity();
    aiIntegrations.project.id = projectId;

    return aiIntegrations;
  }
}
