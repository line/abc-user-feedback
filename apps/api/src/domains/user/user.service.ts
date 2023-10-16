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
import { paginate } from 'nestjs-typeorm-paginate';
import { In, Like, Raw, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { UserInvitationMailingService } from '@/shared/mailing/user-invitation-mailing.service';
import { CodeTypeEnum } from '../../shared/code/code-type.enum';
import { CodeService } from '../../shared/code/code.service';
import { TenantService } from '../tenant/tenant.service';
import type { FindAllUsersDto } from './dtos';
import { InviteUserDto } from './dtos';
import { UpdateUserDto } from './dtos/update-user.dto';
import type { SignUpMethodEnum } from './entities/enums';
import { UserEntity } from './entities/user.entity';
import {
  NotAllowedDomainException,
  UserAlreadyExistsException,
  UserNotFoundException,
} from './exceptions';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly userInvitationMailingService: UserInvitationMailingService,
    private readonly codeService: CodeService,
    private readonly tenantService: TenantService,
  ) {}

  async findAll({ options, query, order }: FindAllUsersDto) {
    const where = query
      ? Object.entries(query).reduce((prev, [key, value]) => {
          if (key === 'projectId') {
            return { ...prev, members: { role: { project: { id: value } } } };
          }
          if (key === 'createdAt') {
            const { lt, gte } = value as any;
            return {
              ...prev,
              createdAt: Raw((alias) => `${alias} >= :gte AND ${alias} < :lt`, {
                lt,
                gte,
              }),
            };
          }
          return { ...prev, [key]: Like(`%${value}%`) };
        }, {})
      : {};

    return await paginate(
      this.userRepo.createQueryBuilder().setFindOptions({
        where,
        order,
        relations: { members: { role: { project: true } } },
      }),
      options,
    );
  }

  async findByEmailAndSignUpMethod(
    email: string,
    signUpMethod: SignUpMethodEnum,
  ) {
    return await this.userRepo.findOne({
      where: { email, signUpMethod },
      withDeleted: true,
    });
  }

  async findById(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
    });
    if (!user) throw new UserNotFoundException();
    return user;
  }

  @Transactional()
  async deleteById(id: number) {
    const user = new UserEntity();
    user.id = id;
    await this.userRepo.remove(user);
  }

  @Transactional()
  async updateUser(dto: UpdateUserDto) {
    const { userId } = dto;
    const user = await this.findById(userId);
    await this.userRepo.save(Object.assign(user, dto));
  }

  @Transactional()
  async sendInvitationCode({
    email,
    roleId,
    userType,
    invitedBy,
  }: InviteUserDto) {
    const user = await this.userRepo.findOneBy({ email });
    if (user) throw new UserAlreadyExistsException();

    const code = await this.codeService.setCode({
      type: CodeTypeEnum.USER_INVITATION,
      key: email,
      data: { roleId, userType, invitedBy },
      durationSec: 60 * 60 * 24,
    });
    await this.userInvitationMailingService.send({ code, email });
  }

  @Transactional()
  async deleteUsers(ids: number[]) {
    const users = await this.userRepo.find({
      where: { id: In(ids) },
      relations: { members: true },
    });
    await this.userRepo.remove(users);
  }

  async validateEmail(email: string) {
    const tenant = await this.tenantService.findOne();
    const domain = email.split('@')[1];
    if (tenant.isRestrictDomain && !tenant.allowDomains.includes(domain)) {
      throw new NotAllowedDomainException();
    }
    return true;
  }

  async findRolesById(id: number) {
    const { members } = await this.userRepo.findOne({
      where: { id },
      select: { members: true },
      relations: { members: { role: { project: true } } },
    });
    return members.map((v) => v.role);
  }
}
