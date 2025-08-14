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

@Entity('ai_field_templates')
export class AIFieldTemplatesEntity extends CommonEntity {
  @Column('varchar', { default: '' })
  title: string;

  @Column('mediumtext')
  prompt: string;

  @Column('varchar')
  model: string | null;

  @Column('float', { default: 0.5 })
  temperature: number;

  @ManyToOne(() => ProjectEntity, (project) => project.aiFieldTemplates, {
    onDelete: 'CASCADE',
  })
  project: Relation<ProjectEntity>;

  @OneToMany(() => FieldEntity, (field) => field.aiFieldTemplate, {
    nullable: true,
    cascade: true,
  })
  fields: Relation<FieldEntity>[];

  static from({
    title,
    prompt,
    model,
    temperature,
    projectId,
  }: {
    title: string;
    prompt: string;
    model: string | null;
    temperature: number;
    projectId: number;
  }) {
    const aiFieldTemplate = new AIFieldTemplatesEntity();

    aiFieldTemplate.title = title;
    aiFieldTemplate.prompt = prompt;
    aiFieldTemplate.model = model;
    aiFieldTemplate.temperature = temperature;
    aiFieldTemplate.project = new ProjectEntity();
    aiFieldTemplate.project.id = projectId;
    return aiFieldTemplate;
  }
}
