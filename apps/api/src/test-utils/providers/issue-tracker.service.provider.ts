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
import { getRepositoryToken } from '@nestjs/typeorm';

import { IssueTrackerEntity } from '../../domains/admin/project/issue-tracker/issue-tracker.entity';
import { IssueTrackerService } from '../../domains/admin/project/issue-tracker/issue-tracker.service';
import { IssueTrackerRepositoryStub } from '../stubs/issue-tracker-repository.stub';

export const IssueTrackerServiceProviders = [
  IssueTrackerService,
  {
    provide: getRepositoryToken(IssueTrackerEntity),
    useClass: IssueTrackerRepositoryStub,
  },
];
