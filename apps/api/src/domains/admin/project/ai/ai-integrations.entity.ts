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
  apiKey: string;

  @Column('varchar', { default: '' })
  endpointUrl: string;

  @Column('mediumtext')
  systemPrompt: string;

  @Column('int', { nullable: true, default: null })
  tokenThreshold: number | null;

  @Column('float', { nullable: true, default: null })
  notificationThreshold: number | null;

  @OneToOne(() => ProjectEntity, (project) => project.aiIntegrations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  project: Relation<ProjectEntity>;

  static from({
    provider,
    apiKey,
    endpointUrl,
    systemPrompt,
    tokenThreshold,
    notificationThreshold,
    projectId,
  }: {
    provider: AIProvidersEnum;
    apiKey: string;
    endpointUrl: string;
    systemPrompt: string;
    tokenThreshold?: number | null;
    notificationThreshold?: number | null;
    projectId: number;
  }) {
    const aiIntegrations = new AIIntegrationsEntity();

    aiIntegrations.provider = provider;
    aiIntegrations.apiKey = apiKey;
    aiIntegrations.endpointUrl = endpointUrl;
    aiIntegrations.systemPrompt = systemPrompt;
    if (tokenThreshold) {
      aiIntegrations.tokenThreshold = tokenThreshold;
    }
    if (notificationThreshold) {
      aiIntegrations.notificationThreshold = notificationThreshold;
    }
    aiIntegrations.project = new ProjectEntity();
    aiIntegrations.project.id = projectId;

    return aiIntegrations;
  }
}
