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
import { Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FeedbackEntity } from '@/domains/feedback/feedback.entity';
import { IssueEntity } from '@/domains/project/issue/issue.entity';
import { ProjectEntity } from '@/domains/project/project/project.entity';
import { FeedbackIssueStatisticsController } from './feedback-issue-statistics.controller';
import { FeedbackIssueStatisticsEntity } from './feedback-issue-statistics.entity';
import { FeedbackIssueStatisticsService } from './feedback-issue-statistics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FeedbackIssueStatisticsEntity,
      FeedbackEntity,
      IssueEntity,
      ProjectEntity,
    ]),
  ],
  exports: [FeedbackIssueStatisticsService],
  providers: [FeedbackIssueStatisticsService],
  controllers: [FeedbackIssueStatisticsController],
})
export class FeedbackIssueStatisticsModule {
  constructor(
    private readonly service: FeedbackIssueStatisticsService,
    @InjectRepository(ProjectEntity)
    private readonly projectRepo: Repository<ProjectEntity>,
  ) {}
  async onModuleInit() {
    const projects = await this.projectRepo.find({
      select: ['id'],
    });
    for (const { id } of projects) {
      await this.service.addCronJobByProjectId(id);
    }
  }
}
