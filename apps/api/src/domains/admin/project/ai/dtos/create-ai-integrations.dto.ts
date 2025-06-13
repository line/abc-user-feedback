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
import { Expose, plainToInstance } from 'class-transformer';

import { AIProvidersEnum } from '@/common/enums/ai-providers.enum';
import { AIIntegrationsEntity } from '../ai-integrations.entity';

export class CreateAIIntegrationsDto {
  @Expose()
  projectId: number;

  @Expose()
  provider: AIProvidersEnum;

  @Expose()
  apiKey: string;

  @Expose()
  endpointUrl: string;

  @Expose()
  systemPrompt: string;

  @Expose()
  tokenThreshold: number | null;

  @Expose()
  notificationThreshold: number | null;

  public static from(params: any): CreateAIIntegrationsDto {
    return plainToInstance(CreateAIIntegrationsDto, params, {
      excludeExtraneousValues: true,
    });
  }

  static toAIIntegrationsEntity(params: CreateAIIntegrationsDto) {
    const {
      provider,
      apiKey,
      endpointUrl,
      projectId,
      systemPrompt,
      tokenThreshold,
      notificationThreshold,
    } = params;

    return AIIntegrationsEntity.from({
      provider,
      apiKey,
      endpointUrl,
      systemPrompt,
      projectId,
      tokenThreshold,
      notificationThreshold,
    });
  }
}
