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
import { ProjectEntity } from '../../project/project/project.entity';
import { IssueEntity } from '../issue/issue.entity';

@Entity('categories')
@Index(['createdAt'])
@Unique('category-name-unique', ['name', 'project'])
export class CategoryEntity extends CommonEntity {
  @Column('varchar', { length: 255 })
  name: string;

  @ManyToOne(() => ProjectEntity, (project) => project.categories, {
    onDelete: 'CASCADE',
  })
  project: Relation<ProjectEntity>;

  @OneToMany(() => IssueEntity, (issue) => issue.category, {
    cascade: true,
  })
  issues: Relation<IssueEntity>[];

  static from({ projectId, name }: { projectId: number; name: string }) {
    const category = new CategoryEntity();
    category.name = name;
    category.project = new ProjectEntity();
    category.project.id = projectId;

    return category;
  }
}
