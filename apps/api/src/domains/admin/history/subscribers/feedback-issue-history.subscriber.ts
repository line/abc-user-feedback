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
import { InjectDataSource } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import type { EntitySubscriberInterface } from 'typeorm';
import { DataSource, EventSubscriber } from 'typeorm';

import type { ClsServiceType } from '@/types/cls-service.type';
import { HistoryActionEnum } from '../history-action.enum';
import { EntityNameEnum } from '../history-entity.enum';
import { HistoryService } from '../history.service';

@EventSubscriber()
export class FeedbackIssueHistorySubscriber
  implements EntitySubscriberInterface
{
  constructor(
    @InjectDataSource() dataSource: DataSource,
    readonly cls: ClsService<ClsServiceType>,
    readonly historyService: HistoryService,
  ) {
    dataSource.subscribers.push(this);
  }
  listenTo() {
    return 'feedbacks_issues_issues';
  }
  afterInsert(): void | Promise<any> {
    this.saveHistory(HistoryActionEnum.Create);
  }
  afterRemove(): void | Promise<any> {
    this.saveHistory(HistoryActionEnum.SoftDelete);
  }
  private saveHistory(action: HistoryActionEnum) {
    const userId = this.cls.get('userId');
    if (!userId) return;
    const data: { feedbackId: number } | undefined =
      action === HistoryActionEnum.Create ?
        this.cls.get('addIssueInFeedback')
      : this.cls.get('removeIssueInFeedback');
    if (!data) return;

    void this.historyService.createHistory({
      userId,
      entityId: data.feedbackId,
      entityName: EntityNameEnum.FeedbackIssue,
      action,
      entity: data,
    });
  }
}
