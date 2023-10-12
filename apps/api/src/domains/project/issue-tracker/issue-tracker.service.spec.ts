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
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { mockRepository } from '@/utils/test-utils';
import { UpdateIssueTrackerDto } from './dtos';
import { IssueTrackerEntity } from './issue-tracker.entity';
import { IssueTrackerService } from './issue-tracker.service';

const IssueTrackerServiceProviders = [
  IssueTrackerService,
  {
    provide: getRepositoryToken(IssueTrackerEntity),
    useValue: mockRepository(),
  },
];

describe('issue-tracker service', () => {
  let issueTrackerService: IssueTrackerService;
  let issueTrackerRepo: Repository<IssueTrackerEntity>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: IssueTrackerServiceProviders,
    }).compile();
    issueTrackerService = module.get(IssueTrackerService);

    issueTrackerRepo = module.get(getRepositoryToken(IssueTrackerEntity));
  });

  describe('update', () => {
    it('updating a issue tracker succeeds with a valid project id', async () => {
      const projectId = faker.datatype.number();
      const dto = new UpdateIssueTrackerDto();
      dto.projectId = projectId;
      dto.data = {
        ticketKey: faker.datatype.string(),
        ticketDomain: faker.internet.domainName(),
      };
      jest
        .spyOn(issueTrackerRepo, 'findOne')
        .mockResolvedValue({} as IssueTrackerEntity);
      jest.spyOn(issueTrackerRepo, 'save');

      await issueTrackerService.update(dto);

      expect(issueTrackerRepo.findOne).toBeCalledTimes(1);
      expect(issueTrackerRepo.findOne).toBeCalledWith({
        where: { project: { id: dto.projectId } },
      });
      expect(issueTrackerRepo.save).toBeCalledTimes(1);
    });
  });
});
