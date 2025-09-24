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

import { AIFieldTemplatesEntity } from '../ai-field-templates.entity';

export class CreateAIFieldTemplateDto {
  @Expose()
  title: string;

  @Expose()
  prompt: string;

  @Expose()
  projectId: number;

  @Expose()
  model: string | null;

  @Expose()
  temperature: number;

  public static from(params: any): CreateAIFieldTemplateDto {
    return plainToInstance(CreateAIFieldTemplateDto, params, {
      excludeExtraneousValues: true,
    });
  }

  static toAITemplateEntity(params: CreateAIFieldTemplateDto) {
    const { title, prompt, projectId, model, temperature } = params;

    return AIFieldTemplatesEntity.from({
      title,
      prompt,
      projectId,
      model,
      temperature,
    });
  }
}
