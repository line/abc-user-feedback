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

import { CreateRoleDto, UpdateRoleDto } from './dtos';
import {
  OwnerRoleIsImmutableException,
  RoleAlreadyExistsException,
  RoleNotFoundException,
} from './exceptions';
import { DefaultRole } from './role.constant';
import { RoleEntity } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepo: Repository<RoleEntity>,
  ) {}

  async createRole(dto: CreateRoleDto) {
    const role = await this.roleRepo.findOneBy({ name: dto.name });
    if (role) throw new RoleAlreadyExistsException();

    return await this.roleRepo.save(dto);
  }

  async updateRole(id: string, dto: UpdateRoleDto) {
    if (dto.name === DefaultRole.Owner) {
      throw new OwnerRoleIsImmutableException();
    }

    await this.roleRepo.update(
      { id },
      { name: dto.name, permissions: [...new Set(dto.permissions)] },
    );
  }

  async findById(id: string) {
    const role = await this.roleRepo.findOneBy({ id });
    if (!role) throw new RoleNotFoundException();
    return role;
  }

  async findAndCount() {
    const [roles, total] = await this.roleRepo.findAndCount();
    return { roles, total };
  }

  async deleteById(id: string) {
    await this.roleRepo.delete({ id });
  }
}
