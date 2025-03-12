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
import { Expose, plainToInstance } from 'class-transformer';

import { IssueStatusEnum } from '@/common/enums';
import { IssueEntity } from '@/domains/admin/project/issue/issue.entity';

export class CreateIssueDto {
  @Expose()
  projectId: number;

  @Expose()
  name: string;

  @Expose()
  status: IssueStatusEnum;

  @Expose()
  description: string | null;

  @Expose()
  externalIssueId: string;

  public static from(params: any): CreateIssueDto {
    return plainToInstance(CreateIssueDto, params, {
      excludeExtraneousValues: true,
    });
  }

  static toIssueEntity(params: CreateIssueDto) {
    const { name, status, description, externalIssueId, projectId } = params;
    return IssueEntity.from({
      name,
      status,
      description,
      externalIssueId,
      projectId,
    });
  }
}
