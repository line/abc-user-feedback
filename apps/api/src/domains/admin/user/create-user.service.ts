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

import { MemberService } from '../project/member/member.service';
import { TenantService } from '../tenant/tenant.service';
import type { CreateEmailUserDto, CreateInvitationUserDto } from './dtos';
import type { CreateOAuthUserDto } from './dtos/create-oauth-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { SignUpMethodEnum } from './entities/enums';
import { UserEntity } from './entities/user.entity';
import {
  NotAllowedDomainException,
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
    private readonly memberService: MemberService,
  ) {}

  async createOAuthUser({ email }: CreateOAuthUserDto) {
    return await this.createUser({
      email,
      method: 'oauth',
      hashPassword: '',
      signUpMethod: SignUpMethodEnum.OAUTH,
    });
  }

  async createEmailUser(dto: CreateEmailUserDto) {
    const { password, ...rest } = dto;

    return await this.createUser({
      ...rest,
      method: 'email',
      hashPassword: await this.userPasswordService.createHashPassword(password),
      signUpMethod: SignUpMethodEnum.EMAIL,
    });
  }

  async createInvitationUser(dto: CreateInvitationUserDto) {
    const { password, ...rest } = dto;
    return await this.createUser({
      ...rest,
      method: 'invitation',
      hashPassword: await this.userPasswordService.createHashPassword(password),
      signUpMethod: SignUpMethodEnum.EMAIL,
    });
  }

  @Transactional()
  protected async createUser(dto: CreateUserDto) {
    const { method, email } = dto;

    const user = await this.userRepo.findOneBy({ email });
    if (user) throw new UserAlreadyExistsException();

    const tenant = await this.tenantService.findOne();
    // check restrict domain
    const domain = email.split('@')[1];

    if (
      tenant.allowDomains &&
      tenant.allowDomains.length > 0 &&
      !tenant.allowDomains.includes(domain)
    ) {
      throw new NotAllowedDomainException();
    }

    const newUser = await this.userRepo.save(dto);

    if (method === 'invitation' && dto.roleId) {
      await this.memberService.create({
        roleId: dto.roleId,
        userId: newUser.id,
      });
    }

    return newUser;
  }
}
