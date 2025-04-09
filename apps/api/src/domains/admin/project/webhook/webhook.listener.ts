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
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import type { AxiosError } from 'axios';
import { catchError, lastValueFrom, of, retry, tap, timer } from 'rxjs';
import { Repository } from 'typeorm';

import type { IssueStatusEnum } from '@/common/enums';
import {
  EventStatusEnum,
  EventTypeEnum,
  WebhookStatusEnum,
} from '@/common/enums';
import { FeedbackEntity } from '../../feedback/feedback.entity';
import { IssueEntity } from '../issue/issue.entity';
import { WebhookEntity } from './webhook.entity';

@Injectable()
export class WebhookListener {
  private logger = new Logger(WebhookListener.name);
  constructor(
    @InjectRepository(WebhookEntity)
    private readonly webhookRepo: Repository<WebhookEntity>,
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepo: Repository<FeedbackEntity>,
    @InjectRepository(IssueEntity)
    private readonly issueRepo: Repository<IssueEntity>,
    private readonly httpService: HttpService,
  ) {}

  private async sendWebhooks({
    webhooks,
    event,
    data,
  }: {
    webhooks: WebhookEntity[];
    event: EventTypeEnum;
    data: object;
  }) {
    await Promise.all(
      webhooks.map((webhook) =>
        lastValueFrom(
          this.httpService
            .post(
              webhook.url,
              { event, data },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'x-webhook-token': webhook.token,
                },
              },
            )
            .pipe(
              tap(() => {
                this.logger.log(
                  `Successfully sent webhook to ${webhook.url}(event: ${event}, data: ${JSON.stringify(data)}, token: ${webhook.token})`,
                );
              }),
              retry({
                count: 3,
                delay: (error, retryCount) => {
                  this.logger.warn(
                    `Retrying webhook... Attempt #${retryCount + 1}`,
                  );
                  return timer(3000);
                },
              }),
              catchError((error: AxiosError) => {
                this.logger.error({
                  message: 'Failed to send webhook',
                  axiosError:
                    error.response?.data ?
                      {
                        data: error.response.data,
                        status: error.response.status,
                      }
                    : { message: error.message },
                });
                return of(null);
              }),
            ),
        ).catch((error) => {
          this.logger.error(
            'Error sending webhook after RxJS catchError',
            error,
          );
        }),
      ),
    );
  }

  @OnEvent(EventTypeEnum.FEEDBACK_CREATION)
  async handleFeedbackCreation({ feedbackId }: { feedbackId: number }) {
    const feedback = await this.feedbackRepo.findOne({
      where: { id: feedbackId },
      relations: {
        channel: {
          project: true,
        },
        issues: true,
      },
    });

    if (feedback === null)
      throw new NotFoundException(`Feedback ${feedbackId} not found`);
    const webhooks = await this.webhookRepo.find({
      where: {
        project: { id: feedback.channel.project.id },
        status: WebhookStatusEnum.ACTIVE,
        events: {
          channels: { id: feedback.channel.id },
          status: EventStatusEnum.ACTIVE,
          type: EventTypeEnum.FEEDBACK_CREATION,
        },
      },
    });
    const data = {
      feedback: {
        id: feedback.id,
        createdAt: feedback.createdAt,
        updatedAt: feedback.updatedAt,
        ...feedback.data,
        issues: feedback.issues.map((issue) => ({
          id: issue.id,
          createdAt: issue.createdAt,
          updatedAt: issue.updatedAt,
          name: issue.name,
          description: issue.description,
          status: issue.status,
          externalIssueId: issue.externalIssueId,
          feedbackCount: issue.feedbackCount,
        })),
      },
      channel: {
        id: feedback.channel.id,
        name: feedback.channel.name,
      },
      project: {
        id: feedback.channel.project.id,
        name: feedback.channel.project.name,
      },
    };

    void this.sendWebhooks({
      webhooks,
      event: EventTypeEnum.FEEDBACK_CREATION,
      data,
    });
  }

  @OnEvent(EventTypeEnum.ISSUE_ADDITION)
  async handleIssueAddition({
    feedbackId,
    issueId,
  }: {
    feedbackId: number;
    issueId: number;
  }) {
    const feedback =
      (await this.feedbackRepo.findOne({
        where: { id: feedbackId },
        relations: {
          channel: {
            project: true,
          },
          issues: true,
        },
      })) ?? new FeedbackEntity();
    const webhooks = await this.webhookRepo.find({
      where: {
        project: { id: feedback.channel.project.id },
        status: WebhookStatusEnum.ACTIVE,
        events: {
          channels: { id: feedback.channel.id },
          status: EventStatusEnum.ACTIVE,
          type: EventTypeEnum.ISSUE_ADDITION,
        },
      },
    });
    const issues = feedback.issues.map((issue) => ({
      id: issue.id,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
      name: issue.name,
      description: issue.description,
      status: issue.status,
      externalIssueId: issue.externalIssueId,
      feedbackCount: issue.feedbackCount,
    }));
    const data = {
      feedback: {
        id: feedback.id,
        createdAt: feedback.createdAt,
        updatedAt: feedback.updatedAt,
        ...feedback.data,
        issues,
      },
      channel: {
        id: feedback.channel.id,
        name: feedback.channel.name,
      },
      project: {
        id: feedback.channel.project.id,
        name: feedback.channel.project.name,
      },
      addedIssue: issues.find((issue) => issue.id === issueId),
    };

    void this.sendWebhooks({
      webhooks,
      event: EventTypeEnum.ISSUE_ADDITION,
      data,
    });
  }

  @OnEvent(EventTypeEnum.ISSUE_CREATION)
  async handleIssueCreation({ issueId }: { issueId: number }) {
    const issue =
      (await this.issueRepo.findOne({
        where: { id: issueId },
        relations: {
          project: true,
        },
      })) ?? new IssueEntity();
    const webhooks = await this.webhookRepo.find({
      where: {
        project: { id: issue.project.id },
        status: WebhookStatusEnum.ACTIVE,
        events: {
          status: EventStatusEnum.ACTIVE,
          type: EventTypeEnum.ISSUE_CREATION,
        },
      },
    });
    const data = {
      issue: {
        id: issue.id,
        createdAt: issue.createdAt,
        updatedAt: issue.updatedAt,
        name: issue.name,
        description: issue.description,
        status: issue.status,
        externalIssueId: issue.externalIssueId,
        feedbackCount: issue.feedbackCount,
      },
      project: {
        id: issue.project.id,
        name: issue.project.name,
      },
    };

    void this.sendWebhooks({
      webhooks,
      event: EventTypeEnum.ISSUE_CREATION,
      data,
    });
  }

  @OnEvent(EventTypeEnum.ISSUE_STATUS_CHANGE)
  async handleIssueStatusChange({
    issueId,
    previousStatus,
  }: {
    issueId: number;
    previousStatus: IssueStatusEnum;
  }) {
    const issue =
      (await this.issueRepo.findOne({
        where: { id: issueId },
        relations: {
          project: true,
        },
      })) ?? new IssueEntity();
    const webhooks = await this.webhookRepo.find({
      where: {
        project: { id: issue.project.id },
        status: WebhookStatusEnum.ACTIVE,
        events: {
          status: EventStatusEnum.ACTIVE,
          type: EventTypeEnum.ISSUE_STATUS_CHANGE,
        },
      },
    });
    const data = {
      issue: {
        id: issue.id,
        createdAt: issue.createdAt,
        updatedAt: issue.updatedAt,
        name: issue.name,
        description: issue.description,
        status: issue.status,
        externalIssueId: issue.externalIssueId,
        feedbackCount: issue.feedbackCount,
      },
      project: {
        id: issue.project.id,
        name: issue.project.name,
      },
      previousStatus,
    };

    void this.sendWebhooks({
      webhooks,
      event: EventTypeEnum.ISSUE_STATUS_CHANGE,
      data,
    });
  }
}
