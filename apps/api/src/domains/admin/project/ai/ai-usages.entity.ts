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
import { AIProvidersEnum } from '@/common/enums/ai-providers.enum';
import { ProjectEntity } from '../project/project.entity';

export enum UsageCategoryEnum {
  AI_FIELD = 'AI_FIELD',
  ISSUE_RECOMMEND = 'ISSUE_RECOMMEND',
}

@Entity('ai_usages')
export class AIUsagesEntity extends CommonEntity {
  @Column('int')
  year: number;

  @Column('int')
  month: number;

  @Column('int')
  day: number;

  @Column('enum', { enum: UsageCategoryEnum })
  category: UsageCategoryEnum;

  @Column('enum', { enum: AIProvidersEnum })
  provider: AIProvidersEnum;

  @Column('int')
  usedTokens: number;

  @ManyToOne(() => ProjectEntity, (project) => project.aiUsages, {
    onDelete: 'CASCADE',
  })
  project: Relation<ProjectEntity>;

  static from({
    year,
    month,
    day,
    category,
    provider,
    usedTokens,
    projectId,
  }: {
    year: number;
    month: number;
    day: number;
    category: UsageCategoryEnum;
    provider: AIProvidersEnum;
    usedTokens: number;
    projectId: number;
  }): AIUsagesEntity {
    const aiUsages = new AIUsagesEntity();

    aiUsages.year = year;
    aiUsages.month = month;
    aiUsages.day = day;
    aiUsages.category = category;
    aiUsages.provider = provider;
    aiUsages.usedTokens = usedTokens;

    aiUsages.project = new ProjectEntity();
    aiUsages.project.id = projectId;

    return aiUsages;
  }
}
