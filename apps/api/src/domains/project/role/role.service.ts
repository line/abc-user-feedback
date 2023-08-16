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
import { Not, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { CreateRoleDto, UpdateRoleDto } from './dtos';
import {
  RoleAlreadyExistsException,
  RoleNotFoundException,
} from './exceptions';
import { RoleEntity } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
  ) {}

  @Transactional()
  async create({ name, permissions, projectId }: CreateRoleDto) {
    const role = await this.roleRepo.findOneBy({
      name,
      project: { id: projectId },
    });

    if (role) throw new RoleAlreadyExistsException();

    return await this.roleRepo.save({
      name,
      permissions,
      project: { id: projectId },
    });
  }

  @Transactional()
  async update(id: number, projectId: number, dto: UpdateRoleDto) {
    const { name, permissions } = dto;

    const role = await this.roleRepo.findOneBy({
      name,
      project: { id: projectId },
      id: Not(id),
    });

    if (role) throw new RoleAlreadyExistsException();

    await this.roleRepo.update(id, {
      id,
      name,
      permissions: [...new Set(permissions)],
    });
  }

  async findById(id: number) {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: { project: true },
    });
    if (!role) throw new RoleNotFoundException();
    return role;
  }

  async findByUserId(userId: number) {
    const role = await this.roleRepo.find({
      where: { members: { user: { id: userId } } },
      relations: { project: true },
    });
    return role;
  }

  async findByProjectId(projectId: number) {
    const [roles, total] = await this.roleRepo.findAndCountBy({
      project: { id: projectId },
    });
    return { roles, total };
  }

  async findByProjectNameAndRoleName(projectName: string, roleName: string) {
    const role = await this.roleRepo.findOne({
      where: { project: { name: projectName }, name: roleName },
      relations: { project: true },
    });
    if (!role) throw new RoleNotFoundException();
    return role;
  }

  async findAndCount() {
    const [roles, total] = await this.roleRepo.findAndCount();
    return { roles, total };
  }

  @Transactional()
  async deleteById(id: number) {
    const role = new RoleEntity();
    role.id = id;
    await this.roleRepo.remove(role);
  }
}
