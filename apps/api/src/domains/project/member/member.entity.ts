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
import { Entity, ManyToOne, Relation, Unique } from 'typeorm';

import { CommonEntity } from '@/common/entities';

import { UserEntity } from '../../user/entities/user.entity';
import { RoleEntity } from '../role/role.entity';

@Entity('members')
@Unique(['role', 'user'])
export class MemberEntity extends CommonEntity {
  @ManyToOne(() => RoleEntity, (role) => role.members, {
    onDelete: 'CASCADE',
  })
  role: Relation<RoleEntity>;

  @ManyToOne(() => UserEntity, (user) => user.members, {
    onDelete: 'CASCADE',
  })
  user: Relation<UserEntity>;

  static from({
    roleId,
    userId,
  }: {
    roleId: number;
    userId: number;
  }): MemberEntity {
    const member = new MemberEntity();
    member.role = new RoleEntity();
    member.role.id = roleId;
    member.user = new UserEntity();
    member.user.id = userId;
    return member;
  }
}
