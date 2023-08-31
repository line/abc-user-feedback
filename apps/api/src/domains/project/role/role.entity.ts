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
import { Column, Entity, Index, ManyToOne, OneToMany, Relation } from 'typeorm';

import { CommonEntity } from '@/common/entities';

import { MemberEntity } from '../member/member.entity';
import { ProjectEntity } from '../project/project.entity';
import { PermissionEnum } from './permission.enum';

@Entity('roles')
@Index(['name', 'project'])
export class RoleEntity extends CommonEntity {
  @Column('varchar', { length: 255 })
  name: string;

  @OneToMany(() => MemberEntity, (member) => member.role, { cascade: true })
  members: Relation<MemberEntity>[];

  @Column('simple-array')
  permissions: PermissionEnum[];

  @ManyToOne(() => ProjectEntity, (project) => project.roles, {
    onDelete: 'CASCADE',
  })
  project: Relation<ProjectEntity>;

  static from({
    projectId,
    name,
    permissions,
  }: {
    projectId: number;
    name: string;
    permissions: PermissionEnum[];
  }) {
    const role = new RoleEntity();
    role.project = new ProjectEntity();
    role.project.id = projectId;
    role.name = name;
    role.permissions = permissions;

    return role;
  }
}
