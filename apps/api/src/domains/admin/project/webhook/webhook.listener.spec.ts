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

import { faker } from '@faker-js/faker';
import { HttpService } from '@nestjs/axios';
import { Test } from '@nestjs/testing';
import type { AxiosResponse } from 'axios';
import { of } from 'rxjs';

import { EventTypeEnum, IssueStatusEnum } from '@/common/enums';
import { webhookFixture } from '@/test-utils/fixtures';
import { getRandomEnumValue, TestConfig } from '@/test-utils/util-functions';
import { WebhookListenerProviders } from '../../../../test-utils/providers/webhook.listener.provider';
import { WebhookListener } from './webhook.listener';

describe('webhook listener', () => {
  let webhookListener: WebhookListener;
  let httpService: HttpService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: WebhookListenerProviders,
    }).compile();
    webhookListener = module.get(WebhookListener);
    httpService = module.get(HttpService);
  });

  describe('handleFeedbackCreation', () => {
    it('sending webhooks succeeds when feedback is created', async () => {
      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => of({} as AxiosResponse));

      await webhookListener.handleFeedbackCreation({
        feedbackId: faker.number.int(),
      });

      expect(httpService.post).toHaveBeenCalledTimes(
        webhookFixture.events.filter(
          (event) => event.type === EventTypeEnum.FEEDBACK_CREATION,
        ).length,
      );
      expect(httpService.post).toHaveBeenCalledWith(
        webhookFixture.url,
        expect.objectContaining({ event: EventTypeEnum.FEEDBACK_CREATION }),
        {
          headers: {
            'Content-Type': 'application/json',
            'x-webhook-token': 'TEST-TOKEN',
          },
        },
      );
    });
  });

  describe('handleIssueAddition', () => {
    it('sending webhooks succeeds when an issue is added to feedback', async () => {
      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => of({} as AxiosResponse));

      await webhookListener.handleIssueAddition({
        feedbackId: faker.number.int(),
        issueId: faker.number.int(),
      });

      expect(httpService.post).toHaveBeenCalledTimes(
        webhookFixture.events.filter(
          (event) => event.type === EventTypeEnum.ISSUE_ADDITION,
        ).length,
      );
      expect(httpService.post).toHaveBeenCalledWith(
        webhookFixture.url,
        expect.objectContaining({ event: EventTypeEnum.ISSUE_ADDITION }),
        {
          headers: {
            'Content-Type': 'application/json',
            'x-webhook-token': 'TEST-TOKEN',
          },
        },
      );
    });
  });

  describe('handleIssueCreation', () => {
    it('sending webhooks succeeds when an issue is created', async () => {
      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => of({} as AxiosResponse));

      await webhookListener.handleIssueCreation({
        issueId: faker.number.int(),
      });

      expect(httpService.post).toHaveBeenCalledTimes(
        webhookFixture.events.filter(
          (event) => event.type === EventTypeEnum.ISSUE_CREATION,
        ).length,
      );
      expect(httpService.post).toHaveBeenCalledWith(
        webhookFixture.url,
        expect.objectContaining({ event: EventTypeEnum.ISSUE_CREATION }),
        {
          headers: {
            'Content-Type': 'application/json',
            'x-webhook-token': 'TEST-TOKEN',
          },
        },
      );
    });
  });

  describe('handleIssueStatusChange', () => {
    it('sending webhooks succeeds when a status of issue is changed', async () => {
      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => of({} as AxiosResponse));

      await webhookListener.handleIssueStatusChange({
        issueId: faker.number.int(),
        previousStatus: getRandomEnumValue(IssueStatusEnum),
      });

      expect(httpService.post).toHaveBeenCalledTimes(
        webhookFixture.events.filter(
          (event) => event.type === EventTypeEnum.ISSUE_STATUS_CHANGE,
        ).length,
      );
      expect(httpService.post).toHaveBeenCalledWith(
        webhookFixture.url,
        expect.objectContaining({ event: EventTypeEnum.ISSUE_STATUS_CHANGE }),
        {
          headers: {
            'Content-Type': 'application/json',
            'x-webhook-token': 'TEST-TOKEN',
          },
        },
      );
    });
  });
});
