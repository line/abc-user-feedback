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
import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  EventTypeEnum,
  FieldFormatEnum,
  FieldStatusEnum,
} from '@/common/enums';
import { FieldEntity } from '../../channel/field/field.entity';
import { FeedbackEntity } from '../../feedback/feedback.entity';
import { AIService } from './ai.service';

@Injectable()
export class AIListener {
  constructor(
    @InjectRepository(FieldEntity)
    private readonly fieldRepo: Repository<FieldEntity>,
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepo: Repository<FeedbackEntity>,

    private readonly aiService: AIService,
  ) {}

  @OnEvent(EventTypeEnum.FEEDBACK_CREATION)
  async handleFeedbackCreation({
    feedbackId,
    manual,
  }: {
    feedbackId: number;
    manual?: boolean | undefined;
  }) {
    const feedback = await this.feedbackRepo.findOne({
      where: { id: feedbackId },
      relations: {
        channel: {
          project: true,
        },
      },
    });

    if (feedback === null)
      throw new NotFoundException(`Feedback ${feedbackId} not found`);

    const fields = await this.fieldRepo.find({
      where: { channel: { id: feedback.channel.id } },
      relations: { options: true, aiFieldTemplate: true },
    });

    fields.forEach((field) => {
      if (
        field.format === FieldFormatEnum.aiField &&
        field.status === FieldStatusEnum.ACTIVE
      ) {
        if (field.aiFieldAutoProcessing || manual) {
          const targetFields = fields.filter((f) =>
            field.aiFieldTargetKeys?.includes(f.key),
          );

          void this.aiService.executeAIFieldPrompt(
            feedback,
            field,
            targetFields,
            fields,
            true,
          );
        }
      }
    });
  }
}
