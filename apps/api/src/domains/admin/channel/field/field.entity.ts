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
  FieldPropertyEnum,
  FieldStatusEnum,
} from '../../../../common/enums';
import { AIFieldTemplatesEntity } from '../../project/ai/ai-field-templates.entity';
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
  description: string | null;

  @Column('enum', { enum: FieldFormatEnum })
  format: FieldFormatEnum;

  @Column('enum', { enum: FieldPropertyEnum })
  property: FieldPropertyEnum;

  @Column('enum', { enum: FieldStatusEnum })
  status: FieldStatusEnum;

  @Column('int', { default: 0 })
  order: number | null;

  @ManyToOne(
    () => AIFieldTemplatesEntity,
    (aiFieldTemplate) => aiFieldTemplate.fields,
    {
      onDelete: 'CASCADE',
      orphanedRowAction: 'delete',
      nullable: true,
    },
  )
  aiFieldTemplate: Relation<AIFieldTemplatesEntity> | null;

  @Column('json', { nullable: true })
  aiFieldTargetKeys: string[] | null;

  @Column('boolean', { nullable: true })
  aiFieldAutoProcessing: boolean | null;

  @ManyToOne(() => ChannelEntity, (channel) => channel.fields, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  channel: Relation<ChannelEntity>;

  @OneToMany(() => OptionEntity, (option) => option.field, {
    nullable: true,
    cascade: true,
  })
  options: Relation<OptionEntity>[] | undefined;

  static from({
    channelId,
    name,
    key,
    description,
    format,
    property,
    status,
    order,
    aiFieldTemplateId,
    aiFieldTargetKeys,
    aiFieldAutoProcessing,
  }: {
    channelId: number;
    name: string;
    key: string;
    description: string | null;
    format: FieldFormatEnum;
    property: FieldPropertyEnum;
    status: FieldStatusEnum;
    order?: number | null;
    aiFieldTemplateId?: number | null;
    aiFieldTargetKeys?: string[] | null;
    aiFieldAutoProcessing?: boolean | null;
  }) {
    const field = new FieldEntity();
    field.channel = new ChannelEntity();
    field.channel.id = channelId;
    field.name = name;
    field.key = key;
    field.description = description;
    field.format = format;
    field.property = property;
    field.status = status;
    field.order = order ?? 0;
    if (aiFieldTemplateId) {
      field.aiFieldTemplate = new AIFieldTemplatesEntity();
      field.aiFieldTemplate.id = aiFieldTemplateId;
    }
    field.aiFieldTargetKeys = aiFieldTargetKeys ?? null;
    field.aiFieldAutoProcessing = aiFieldAutoProcessing ?? null;

    return field;
  }
}
