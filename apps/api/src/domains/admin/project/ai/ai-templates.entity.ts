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
import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';

import { CommonEntity } from '@/common/entities';
import { FieldEntity } from '../../channel/field/field.entity';
import { ProjectEntity } from '../project/project.entity';

@Entity('ai_templates')
export class AITemplatesEntity extends CommonEntity {
  @Column('varchar', { default: '' })
  title: string;

  @Column('varchar')
  prompt: string;

  @Column('boolean', { default: true })
  autoProcessing: boolean;

  @ManyToOne(() => ProjectEntity, (project) => project.aiTemplates, {
    onDelete: 'CASCADE',
  })
  project: Relation<ProjectEntity>;

  @OneToMany(() => FieldEntity, (field) => field.aiTemplate, {
    nullable: true,
    cascade: true,
  })
  field: Relation<FieldEntity>[] | undefined;

  static from({
    title,
    prompt,
    autoProcessing,
    projectId,
  }: {
    title: string;
    prompt: string;
    autoProcessing: boolean;
    projectId: number;
  }) {
    const aiTemplate = new AITemplatesEntity();

    aiTemplate.title = title;
    aiTemplate.prompt = prompt;
    aiTemplate.autoProcessing = autoProcessing;
    aiTemplate.project = new ProjectEntity();
    aiTemplate.project.id = projectId;
    return aiTemplate;
  }
}
