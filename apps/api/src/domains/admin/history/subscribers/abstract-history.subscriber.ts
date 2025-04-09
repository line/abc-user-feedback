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
import type {
  EntitySubscriberInterface,
  InsertEvent,
  ObjectLiteral,
  RecoverEvent,
  RemoveEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { DataSource } from 'typeorm';

import type { CommonEntity } from '@/common/entities';
import { HistoryActionEnum } from '../history-action.enum';
import { EntityNameEnum } from '../history-entity.enum';
import { HistoryService } from '../history.service';

export abstract class AbstractHistorySubscriber<T extends CommonEntity>
  implements EntitySubscriberInterface<T>
{
  constructor(
    @InjectDataSource() dataSource: DataSource,
    readonly cls: ClsService,
    readonly historyService: HistoryService,
    readonly entityName: EntityNameEnum,
  ) {
    dataSource.subscribers.push(this);
  }

  afterInsert({ entity }: InsertEvent<T>): void | Promise<any> {
    this.saveHistory(HistoryActionEnum.Create, entity);
  }
  afterUpdate({ entity }: UpdateEvent<T>): void | Promise<any> {
    this.saveHistory(HistoryActionEnum.Update, entity);
  }
  afterRemove({ databaseEntity }: RemoveEvent<T>): void | Promise<any> {
    this.saveHistory(HistoryActionEnum.Delete, databaseEntity);
  }
  afterSoftRemove({ databaseEntity }: SoftRemoveEvent<T>): void | Promise<any> {
    this.saveHistory(HistoryActionEnum.SoftDelete, databaseEntity);
  }
  afterRecover({ entity }: RecoverEvent<T>): void | Promise<any> {
    this.saveHistory(HistoryActionEnum.Recover, entity);
  }
  private saveHistory(
    action: HistoryActionEnum,
    entity: T | ObjectLiteral | null | undefined,
  ) {
    const userId: number = this.cls.get('userId');

    if (!entity) return;
    void this.historyService.createHistory({
      userId,
      entityId: (entity as CommonEntity).id,
      entityName: this.entityName,
      action,
      entity,
    });
  }
}
