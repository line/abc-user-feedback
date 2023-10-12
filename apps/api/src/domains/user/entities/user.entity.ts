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
import type { Relation } from 'typeorm';
import { Column, Entity, OneToMany, Unique } from 'typeorm';

import { CommonEntity } from '@/common/entities';
import { MemberEntity } from '@/domains/project/member/member.entity';
import { SignUpMethodEnum, UserStateEnum, UserTypeEnum } from './enums';

@Entity('users')
@Unique(['email', 'signUpMethod'])
export class UserEntity extends CommonEntity {
  @Column('varchar', { nullable: true, length: 320 }) // username 64, domain 255 -> {64}@{255} = 320
  email: string | null;

  @Column('varchar', { nullable: true })
  name: string;

  @Column('varchar', { nullable: true })
  department: string | null;

  @Column('enum', { enum: UserStateEnum, default: UserStateEnum.Active })
  state: UserStateEnum;

  @Column('varchar', { nullable: true })
  hashPassword: string;

  @Column('enum', { enum: UserTypeEnum, default: UserTypeEnum.GENERAL })
  type: UserTypeEnum;

  @Column('enum', { enum: SignUpMethodEnum, default: SignUpMethodEnum.EMAIL })
  signUpMethod: SignUpMethodEnum;

  @OneToMany(() => MemberEntity, (member) => member.user, { cascade: true })
  members: Relation<MemberEntity>[];
}
