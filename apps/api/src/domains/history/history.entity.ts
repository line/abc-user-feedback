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
import { Column, Entity, ManyToOne, Relation } from 'typeorm';

import { CommonEntity } from '@/common/entities';

import { UserEntity } from '../user/entities/user.entity';
import { HistoryActionEnum } from './history-action.enum';
import { EntityNameEnum } from './history-entity.enum';

@Entity('histories')
export class HistoryEntity extends CommonEntity {
  @ManyToOne(() => UserEntity, { createForeignKeyConstraints: false })
  user: Relation<UserEntity>;

  @Column('enum', { enum: EntityNameEnum })
  entityName: EntityNameEnum;

  @Column('numeric')
  entityId: number;

  @Column('enum', { enum: HistoryActionEnum })
  action: HistoryActionEnum;

  @Column('json')
  entity: object;
}
