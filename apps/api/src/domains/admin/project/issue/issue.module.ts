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
import { TypeOrmModule } from '@nestjs/typeorm';

import { IssueStatisticsModule } from '@/domains/admin/statistics/issue/issue-statistics.module';
import { SchedulerLockModule } from '@/domains/operation/scheduler-lock/scheduler-lock.module';
import { CategoryEntity } from '../category/category.entity';
import { ProjectEntity } from '../project/project.entity';
import { IssueController } from './issue.controller';
import { IssueEntity } from './issue.entity';
import { IssueService } from './issue.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([IssueEntity, ProjectEntity, CategoryEntity]),
    IssueStatisticsModule,
    SchedulerLockModule,
  ],
  providers: [IssueService],
  controllers: [IssueController],
  exports: [IssueService],
})
export class IssueModule {
  constructor(private readonly service: IssueService) {}
  async onModuleInit() {
    await this.service.addCronJob();
  }
}
