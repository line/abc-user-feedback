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

  private async validateRoleName(name: string, projectId: number) {
    const role = await this.roleRepo.findOneBy({
      name,
      project: { id: projectId },
    });
    if (role) throw new RoleAlreadyExistsException();
  }

  @Transactional()
  async create({ name, permissions, projectId }: CreateRoleDto) {
    await this.validateRoleName(name, projectId);

    const newRole = RoleEntity.from({ name, permissions, projectId });

    return await this.roleRepo.save(newRole);
  }

  @Transactional()
  async createMany(roles: CreateRoleDto[]) {
    for (const { name, projectId } of roles) {
      await this.validateRoleName(name, projectId);
    }

    const newRoles = roles.map((role) => RoleEntity.from(role));

    return await this.roleRepo.save(newRoles);
  }

  @Transactional()
  async update(id: number, projectId: number, dto: UpdateRoleDto) {
    const { name, permissions } = dto;

    const role = (await this.roleRepo.findOneBy({ id })) ?? new RoleEntity();

    if (
      await this.roleRepo.findOne({
        where: {
          name,
          project: { id: projectId },
          id: Not(id),
        },
      })
    )
      throw new RoleAlreadyExistsException();

    return await this.roleRepo.save(
      Object.assign(role, { name, permissions: [...new Set(permissions)] }),
    );
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
