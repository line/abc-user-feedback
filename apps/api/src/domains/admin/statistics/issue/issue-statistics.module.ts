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

import { ChannelEntity } from '@/domains/admin/channel/channel/channel.entity';
import { FeedbackEntity } from '@/domains/admin/feedback/feedback.entity';
import { IssueEntity } from '@/domains/admin/project/issue/issue.entity';
import { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { SchedulerLockModule } from '@/domains/operation/scheduler-lock/scheduler-lock.module';
import { IssueStatisticsController } from './issue-statistics.controller';
import { IssueStatisticsEntity } from './issue-statistics.entity';
import { IssueStatisticsService } from './issue-statistics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IssueStatisticsEntity,
      FeedbackEntity,
      IssueEntity,
      ChannelEntity,
      ProjectEntity,
    ]),
    SchedulerLockModule,
  ],
  exports: [IssueStatisticsService],
  providers: [IssueStatisticsService],
  controllers: [IssueStatisticsController],
})
export class IssueStatisticsModule {
  constructor(
    private readonly service: IssueStatisticsService,
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
