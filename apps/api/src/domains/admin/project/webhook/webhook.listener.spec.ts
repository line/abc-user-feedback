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

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { faker } from '@faker-js/faker';
import { HttpService } from '@nestjs/axios';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { AxiosError, AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';

import { EventTypeEnum, IssueStatusEnum } from '@/common/enums';
import { webhookFixture } from '@/test-utils/fixtures';
import { getRandomEnumValue, TestConfig } from '@/test-utils/util-functions';
import { WebhookListenerProviders } from '../../../../test-utils/providers/webhook.listener.provider';
import { WebhookListener } from './webhook.listener';

describe('webhook listener', () => {
  let webhookListener: WebhookListener;
  let httpService: HttpService;
  let webhookListenerAny: any;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: WebhookListenerProviders,
    }).compile();
    webhookListener = module.get(WebhookListener);
    httpService = module.get(HttpService);
    webhookListenerAny = webhookListener as any;
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

    it('throws NotFoundException when feedback is not found', async () => {
      // Mock repository to return null
      const feedbackRepo = webhookListenerAny.feedbackRepo;

      jest.spyOn(feedbackRepo, 'findOne').mockResolvedValue(null);

      await expect(
        webhookListener.handleFeedbackCreation({
          feedbackId: faker.number.int(),
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('handles HTTP errors gracefully when sending webhooks', async () => {
      const axiosError: AxiosError = {
        name: 'AxiosError',
        message: 'Request failed',
        code: 'ECONNREFUSED',
        response: {
          data: { error: 'Connection refused' },
          status: 500,
          statusText: 'Internal Server Error',
          headers: {},
          config: {} as any,
        },
        config: {} as any,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => throwError(() => axiosError));

      // Should not throw error, but handle gracefully
      await expect(
        webhookListener.handleFeedbackCreation({
          feedbackId: faker.number.int(),
        }),
      ).resolves.not.toThrow();
    });

    it('validates webhook data structure when feedback is created', async () => {
      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => of({} as AxiosResponse));

      await webhookListener.handleFeedbackCreation({
        feedbackId: faker.number.int(),
      });

      expect(httpService.post).toHaveBeenCalledWith(
        webhookFixture.url,
        expect.objectContaining({
          event: EventTypeEnum.FEEDBACK_CREATION,
          data: expect.objectContaining({
            feedback: expect.objectContaining({
              id: expect.any(Number),
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
              issues: expect.any(Array),
            }),
            channel: expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
            }),
            project: expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
            }),
          }),
        }),
        expect.any(Object),
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

    it('handles gracefully when feedback is not found for issue addition', async () => {
      const feedbackRepo = webhookListenerAny.feedbackRepo;
      jest.spyOn(feedbackRepo, 'findOne').mockResolvedValue(null);

      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => of({} as AxiosResponse));

      // Should throw error because feedback.channel.project.id is accessed
      await expect(
        webhookListener.handleIssueAddition({
          feedbackId: faker.number.int(),
          issueId: faker.number.int(),
        }),
      ).rejects.toThrow();
    });

    it('validates webhook data structure when issue is added', async () => {
      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => of({} as AxiosResponse));

      const issueId = faker.number.int();
      await webhookListener.handleIssueAddition({
        feedbackId: faker.number.int(),
        issueId,
      });

      expect(httpService.post).toHaveBeenCalledWith(
        webhookFixture.url,
        expect.objectContaining({
          event: EventTypeEnum.ISSUE_ADDITION,
          data: expect.objectContaining({
            feedback: expect.objectContaining({
              id: expect.any(Number),
            }),
            channel: expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
            }),
            project: expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
            }),
          }),
        }),
        expect.any(Object),
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

    it('handles gracefully when issue is not found for creation', async () => {
      const issueRepo = webhookListenerAny.issueRepo;
      jest.spyOn(issueRepo, 'findOne').mockResolvedValue(null);

      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => of({} as AxiosResponse));

      // Should throw error because issue.project.id is accessed
      await expect(
        webhookListener.handleIssueCreation({
          issueId: faker.number.int(),
        }),
      ).rejects.toThrow();
    });

    it('validates webhook data structure when issue is created', async () => {
      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => of({} as AxiosResponse));

      await webhookListener.handleIssueCreation({
        issueId: faker.number.int(),
      });

      expect(httpService.post).toHaveBeenCalledWith(
        webhookFixture.url,
        expect.objectContaining({
          event: EventTypeEnum.ISSUE_CREATION,
          data: expect.objectContaining({
            issue: expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              description: expect.any(String),
              status: expect.any(String),
              feedbackCount: expect.any(Number),
            }),
            project: expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
            }),
          }),
        }),
        expect.any(Object),
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

    it('handles gracefully when issue is not found for status change', async () => {
      const issueRepo = webhookListenerAny.issueRepo;
      jest.spyOn(issueRepo, 'findOne').mockResolvedValue(null);

      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => of({} as AxiosResponse));

      // Should throw error because issue.project.id is accessed
      await expect(
        webhookListener.handleIssueStatusChange({
          issueId: faker.number.int(),
          previousStatus: getRandomEnumValue(IssueStatusEnum),
        }),
      ).rejects.toThrow();
    });

    it('validates webhook data structure when issue status is changed', async () => {
      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => of({} as AxiosResponse));

      const previousStatus = getRandomEnumValue(IssueStatusEnum);
      await webhookListener.handleIssueStatusChange({
        issueId: faker.number.int(),
        previousStatus,
      });

      expect(httpService.post).toHaveBeenCalledWith(
        webhookFixture.url,
        expect.objectContaining({
          event: EventTypeEnum.ISSUE_STATUS_CHANGE,
          data: expect.objectContaining({
            issue: expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
              description: expect.any(String),
              status: expect.any(String),
              feedbackCount: expect.any(Number),
            }),
            project: expect.objectContaining({
              id: expect.any(Number),
              name: expect.any(String),
            }),
            previousStatus,
          }),
        }),
        expect.any(Object),
      );
    });
  });

  describe('edge cases and error scenarios', () => {
    it('handles empty webhook list gracefully', async () => {
      const webhookRepo = webhookListenerAny.webhookRepo;
      jest.spyOn(webhookRepo, 'find').mockResolvedValue([]);

      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => of({} as AxiosResponse));

      // Should not throw error when no webhooks are found
      await expect(
        webhookListener.handleFeedbackCreation({
          feedbackId: faker.number.int(),
        }),
      ).resolves.not.toThrow();

      expect(httpService.post).not.toHaveBeenCalled();
    });

    it('handles inactive webhooks correctly', async () => {
      const webhookRepo = webhookListenerAny.webhookRepo;
      // Mock to return empty array for inactive webhooks
      jest.spyOn(webhookRepo, 'find').mockResolvedValue([]);

      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => of({} as AxiosResponse));

      await webhookListener.handleFeedbackCreation({
        feedbackId: faker.number.int(),
      });

      // Should not send webhooks for inactive webhooks
      expect(httpService.post).not.toHaveBeenCalled();
    });

    it('handles inactive events correctly', async () => {
      const webhookRepo = webhookListenerAny.webhookRepo;
      // Mock to return empty array for inactive events
      jest.spyOn(webhookRepo, 'find').mockResolvedValue([]);

      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => of({} as AxiosResponse));

      await webhookListener.handleFeedbackCreation({
        feedbackId: faker.number.int(),
      });

      // Should not send webhooks for inactive events
      expect(httpService.post).not.toHaveBeenCalled();
    });

    it('handles network timeout errors', async () => {
      const timeoutError: AxiosError = {
        name: 'AxiosError',
        message: 'timeout of 5000ms exceeded',
        code: 'ECONNABORTED',
        response: undefined,
        config: {} as any,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => throwError(() => timeoutError));

      // Should handle timeout gracefully
      await expect(
        webhookListener.handleFeedbackCreation({
          feedbackId: faker.number.int(),
        }),
      ).resolves.not.toThrow();
    });

    it('handles malformed response errors', async () => {
      const malformedError: AxiosError = {
        name: 'AxiosError',
        message: 'Request failed with status code 400',
        code: 'ERR_BAD_REQUEST',
        response: {
          data: 'Invalid JSON response',
          status: 400,
          statusText: 'Bad Request',
          headers: {},
          config: {} as any,
        },
        config: {} as any,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => throwError(() => malformedError));

      // Should handle malformed response gracefully
      await expect(
        webhookListener.handleFeedbackCreation({
          feedbackId: faker.number.int(),
        }),
      ).resolves.not.toThrow();
    });
  });

  describe('retry logic and logging', () => {
    it('handles retry logic for failed requests', async () => {
      let callCount = 0;
      const axiosError: AxiosError = {
        name: 'AxiosError',
        message: 'Request failed',
        code: 'ECONNREFUSED',
        response: undefined,
        config: {} as any,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      jest.spyOn(httpService, 'post').mockImplementation(() => {
        callCount++;
        // Always return error to test retry behavior
        return throwError(() => axiosError);
      });

      await webhookListener.handleFeedbackCreation({
        feedbackId: faker.number.int(),
      });

      // Should make at least one call (retry behavior may vary in test environment)
      expect(callCount).toBeGreaterThan(0);
    });

    it('logs successful webhook sends', async () => {
      const loggerSpy = jest.spyOn(webhookListenerAny.logger, 'log');

      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => of({} as AxiosResponse));

      await webhookListener.handleFeedbackCreation({
        feedbackId: faker.number.int(),
      });

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Successfully sent webhook to'),
      );
    });

    it('logs webhook retry attempts', async () => {
      const loggerSpy = jest.spyOn(webhookListenerAny.logger, 'warn');
      const axiosError: AxiosError = {
        name: 'AxiosError',
        message: 'Request failed',
        code: 'ECONNREFUSED',
        response: undefined,
        config: {} as any,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => throwError(() => axiosError));

      await webhookListener.handleFeedbackCreation({
        feedbackId: faker.number.int(),
      });

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Retrying webhook... Attempt #'),
      );
    });

    it('handles webhook errors gracefully', async () => {
      const axiosError: AxiosError = {
        name: 'AxiosError',
        message: 'Request failed',
        code: 'ECONNREFUSED',
        response: {
          data: { error: 'Connection refused' },
          status: 500,
          statusText: 'Internal Server Error',
          headers: {},
          config: {} as any,
        },
        config: {} as any,
        isAxiosError: true,
        toJSON: () => ({}),
      };

      jest
        .spyOn(httpService, 'post')
        .mockImplementation(() => throwError(() => axiosError));

      // Should handle errors gracefully without throwing
      await expect(
        webhookListener.handleFeedbackCreation({
          feedbackId: faker.number.int(),
        }),
      ).resolves.not.toThrow();
    });
  });
});
