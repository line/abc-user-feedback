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
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  Relation,
  Unique,
} from 'typeorm';

import { CommonEntity } from '@/common/entities';

import {
  FieldFormatEnum,
  FieldStatusEnum,
  FieldTypeEnum,
} from '../../../common/enums';
import { ChannelEntity } from '../channel/channel.entity';
import { OptionEntity } from '../option/option.entity';

@Entity('fields')
@Index(['createdAt'])
@Unique('field-key-unique', ['key', 'channel'])
@Unique('field-name-unique', ['name', 'channel'])
export class FieldEntity extends CommonEntity {
  @Column('varchar')
  name: string;

  @Column('varchar')
  key: string;

  @Column('varchar', { nullable: true })
  description: string;

  @Column('enum', { enum: FieldFormatEnum })
  format: FieldFormatEnum;

  @Column('enum', { enum: FieldTypeEnum })
  type: FieldTypeEnum;

  @Column('enum', { enum: FieldStatusEnum })
  status: FieldStatusEnum;

  @ManyToOne(() => ChannelEntity, (channel) => channel.fields, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  channel: Relation<ChannelEntity>;

  @OneToMany(() => OptionEntity, (option) => option.field, {
    nullable: true,
    cascade: true,
  })
  options: Relation<OptionEntity>[];

  static from({
    channelId,
    name,
    key,
    description,
    format,
    type,
    status,
  }: {
    channelId: number;
    name: string;
    key: string;
    description: string;
    format: FieldFormatEnum;
    type: FieldTypeEnum;
    status: FieldStatusEnum;
  }) {
    const field = new FieldEntity();
    field.channel = new ChannelEntity();
    field.channel.id = channelId;
    field.name = name;
    field.key = key;
    field.description = description;
    field.format = format;
    field.type = type;
    field.status = status;

    return field;
  }
}
