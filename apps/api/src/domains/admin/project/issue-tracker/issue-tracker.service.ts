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
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { CreateIssueTrackerDto, UpdateIssueTrackerDto } from './dtos';
import { IssueTrackerEntity } from './issue-tracker.entity';

@Injectable()
export class IssueTrackerService {
  constructor(
    @InjectRepository(IssueTrackerEntity)
    private readonly repository: Repository<IssueTrackerEntity>,
  ) {}

  @Transactional()
  async create(dto: CreateIssueTrackerDto) {
    const issueTracker = IssueTrackerEntity.from(dto);

    return await this.repository.save(issueTracker);
  }

  async findByProjectId(projectId: number) {
    const issueTracker = await this.repository.findOneBy({
      project: {
        id: projectId,
      },
    });

    return issueTracker;
  }

  @Transactional()
  async update(dto: UpdateIssueTrackerDto) {
    const issueTracker = await this.repository.findOne({
      where: { project: { id: dto.projectId } },
    });
    if (!issueTracker) {
      throw new BadRequestException('no issue tracker for the project id');
    }

    issueTracker.data = dto.data;

    return this.repository.save(issueTracker);
  }
}
