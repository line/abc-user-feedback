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
import { InjectDataSource } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { DataSource, EventSubscriber } from 'typeorm';

import { MemberEntity } from '@/domains/admin/project/member/member.entity';
import { EntityNameEnum } from '../history-entity.enum';
import { HistoryService } from '../history.service';
import { AbstractHistorySubscriber } from './abstract-history.subscriber';

@EventSubscriber()
export class MemberHistorySubscriber extends AbstractHistorySubscriber<MemberEntity> {
  constructor(
    @InjectDataSource() dataSource: DataSource,
    readonly cls: ClsService,
    readonly historyService: HistoryService,
  ) {
    super(dataSource, cls, historyService, EntityNameEnum.Member);
  }
  listenTo() {
    return MemberEntity;
  }
}
