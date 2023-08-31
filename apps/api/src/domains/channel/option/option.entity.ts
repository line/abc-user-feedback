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

import { FieldEntity } from '../field/field.entity';

@Entity('options')
export class OptionEntity extends CommonEntity {
  @ManyToOne(() => FieldEntity, (field) => field.options, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  field: Relation<FieldEntity>;

  @Column('varchar')
  name: string;

  @Column('varchar')
  key: string;

  static from({
    fieldId,
    name,
    key,
  }: {
    fieldId: number;
    name: string;
    key: string;
  }) {
    const option = new OptionEntity();
    option.field = new FieldEntity();
    option.field.id = fieldId;
    option.name = name;
    option.key = key;

    return option;
  }
}
