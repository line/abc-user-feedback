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

import { RoleService } from '../role/role.service';
import { TenantNotFoundException } from '../tenant/exceptions';
import { TenantService } from '../tenant/tenant.service';
import { CreateEmailUserDto, CreateInvitationUserDto } from './dtos';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserEntity } from './entities/user.entity';
import {
  NotAllowDomainException,
  NotAllowUserCreateException,
  UserAlreadyExistsException,
} from './exceptions';
import { UserPasswordService } from './user-password.service';

@Injectable()
export class CreateUserService {
  constructor(
    @InjectRepository(UserEntity)
    protected readonly userRepo: Repository<UserEntity>,
    protected readonly userPasswordService: UserPasswordService,
    protected readonly tenantService: TenantService,
    protected readonly roleService: RoleService,
  ) {}

  async createEmailUser({ email, password }: CreateEmailUserDto) {
    return await this.createUser({
      email,
      hashPassword: await this.userPasswordService.createHashPassword(password),
      type: 'email',
    });
  }

  async createInvitationUser(dto: CreateInvitationUserDto) {
    const { email, password, roleId } = dto;
    return await this.createUser({
      email,
      hashPassword: await this.userPasswordService.createHashPassword(password),
      type: 'invitation',
      roleId,
    });
  }

  protected async createUser(dto: CreateUserDto) {
    const { type, email } = dto;

    const user = await this.userRepo.findOneBy({ email });
    if (user) throw new UserAlreadyExistsException();

    const tenant = await this.tenantService.findOne();
    if (!tenant) throw new TenantNotFoundException();

    // check private
    if (type !== 'invitation' && tenant.isPrivate) {
      throw new NotAllowUserCreateException();
    }

    // check restric domain
    const domain = email.split('@')[1];
    if (tenant.isRestrictDomain && !tenant.allowDomains.includes(domain)) {
      throw new NotAllowDomainException();
    }

    const role =
      type === 'invitation' && dto.roleId
        ? await this.roleService.findById(dto.roleId)
        : tenant.defaultRole;

    const newUser = await this.userRepo.save({
      ...dto,
      role,
    });

    return newUser;
  }
}
