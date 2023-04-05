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

import { RoleNotFoundException } from '../role/exceptions';
import { OWNER_ROLE_DEFAULT_ID } from '../role/role.constant';
import { RoleService } from '../role/role.service';
import { SetupTenantDto, UpdateTenantDto } from './dtos';
import {
  TenantAlreadyExistsException,
  TenantNotFoundException,
} from './exceptions';
import { TenantEntity } from './tenant.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(TenantEntity)
    private readonly tenantRepo: Repository<TenantEntity>,
    private readonly roleService: RoleService,
  ) {}

  async create(dto: SetupTenantDto) {
    const [tenant] = await this.tenantRepo.find({ take: 1 });
    if (tenant) throw new TenantAlreadyExistsException();

    await this.tenantRepo.save({
      ...dto,
      defaultRole: { id: OWNER_ROLE_DEFAULT_ID },
    });
  }

  async update(dto: UpdateTenantDto) {
    const tenant = await this.tenantRepo.findOneBy({ id: dto.id });
    if (!tenant) throw new TenantNotFoundException();

    const defaultRole = await this.roleService.findById(dto.defaultRole.id);
    if (!defaultRole) throw new RoleNotFoundException();

    await this.tenantRepo.update({ id: dto.id }, { ...dto, defaultRole });
  }
  async findOne() {
    const [tenant] = await this.tenantRepo.find({
      relations: { defaultRole: true },
    });

    if (!tenant) throw new TenantNotFoundException();

    return tenant;
  }
}
