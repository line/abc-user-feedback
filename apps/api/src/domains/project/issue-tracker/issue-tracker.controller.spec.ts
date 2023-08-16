/**
 * Copyright 2023 LINE Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
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
import { Test } from '@nestjs/testing';

import { TestConfigs, getMockProvider } from '@/utils/test-utils';

import { IssueTrackerController } from './issue-tracker.controller';
import { IssueTrackerService } from './issue-tracker.service';

const MockIssueTrackerService = {
  create: jest.fn(),
  findByProjectId: jest.fn(),
  update: jest.fn(),
};

describe('IssueTrackerController', () => {
  let issueTrackerController: IssueTrackerController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [...TestConfigs],
      controllers: [IssueTrackerController],
      providers: [
        getMockProvider(IssueTrackerService, MockIssueTrackerService),
      ],
    }).compile();

    issueTrackerController = module.get(IssueTrackerController);
  });

  describe('create', () => {
    it('', async () => {
      jest.spyOn(MockIssueTrackerService, 'create');
      const projectId = faker.datatype.number();

      await issueTrackerController.create(projectId, { data: {} });
      expect(MockIssueTrackerService.create).toBeCalledTimes(1);
    });
  });
  describe('findOne', () => {
    it('', async () => {
      jest.spyOn(MockIssueTrackerService, 'findByProjectId');
      const projectId = faker.datatype.number();

      await issueTrackerController.findOne(projectId);
      expect(MockIssueTrackerService.findByProjectId).toBeCalledTimes(1);
    });
  });
  describe('updateOne', () => {
    it('', async () => {
      jest.spyOn(MockIssueTrackerService, 'update');
      const projectId = faker.datatype.number();

      await issueTrackerController.updateOne(projectId, { data: {} });
      expect(MockIssueTrackerService.update).toBeCalledTimes(1);
    });
  });
});
