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
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { RoleService } from '../role/role.service';
import { CreateMemberDto, FindByProjectIdDto, UpdateMemberDto } from './dtos';
import {
  MemberAlreadyExistsException,
  MemberNotFoundException,
  MemberUpdateRoleNotMatchedProjectException,
} from './exceptions';
import { MemberEntity } from './member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly repository: Repository<MemberEntity>,
    private readonly roleService: RoleService,
  ) {}

  async findByProjectId({ projectId, sort }: FindByProjectIdDto) {
    const [members, total] = await this.repository.findAndCount({
      where: { role: { project: { id: projectId } } },
      order: { createdAt: sort.createdAt },
      relations: { role: true, user: true },
    });
    return { members, total };
  }

  @Transactional()
  async create({ roleId, userId }: CreateMemberDto) {
    const role = await this.roleService.findById(roleId);

    const member = await this.repository.findOne({
      where: {
        user: { id: userId },
        role: { project: { id: role.project.id } },
      },
      select: { id: true },
    });
    if (member) throw new MemberAlreadyExistsException();

    const newMember = MemberEntity.from({ roleId, userId });

    return await this.repository.save(newMember);
  }

  @Transactional()
  async update({ roleId, memberId }: UpdateMemberDto) {
    const role = await this.roleService.findById(roleId);

    const member = await this.repository.findOne({
      where: { id: memberId },
      relations: { role: { project: true } },
    });
    if (!member) throw new MemberNotFoundException();
    if (member.role.project.id !== role.project.id) {
      throw new MemberUpdateRoleNotMatchedProjectException();
    }
    await this.repository.save(Object.assign(member, { role }));
  }

  @Transactional()
  async delete(memberId: number) {
    const member = new MemberEntity();
    member.id = memberId;
    await this.repository.remove(member);
  }
}
