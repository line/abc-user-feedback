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
import { In, Like, Repository } from 'typeorm';

import { UserInvitationMailingService } from '@/shared/mailing/user-invitation-mailing.service';

import { CodeTypeEnum } from '../../shared/code/code-type.enum';
import { CodeService } from '../../shared/code/code.service';
import { RoleService } from '../role/role.service';
import { FindAllUsersDto, InviteUserDto, UpdateUserRoleDto } from './dtos';
import { UserEntity } from './entities/user.entity';
import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from './exceptions';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly roleService: RoleService,
    private readonly userInvitationMailingService: UserInvitationMailingService,
    private readonly codeService: CodeService,
  ) {}

  async findAll({ options, keyword = '' }: FindAllUsersDto) {
    return await paginate<UserEntity>(this.userRepo, options, {
      where: { email: Like(`%${keyword}%`) },
      relations: { role: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findByEmail(email: string) {
    return await this.userRepo.findOne({
      where: { email },
      relations: { role: true },
    });
  }

  async findById(id: string) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: { role: true },
    });
    if (!user) throw new UserNotFoundException();
    return user;
  }
  async deleteById(id: string) {
    await this.userRepo.softDelete({ id });
  }

  async updateUserRole(dto: UpdateUserRoleDto) {
    const { roleId, userId } = dto;
    const role = await this.roleService.findById(roleId);
    await this.userRepo.update({ id: userId }, { role });
  }

  async sendInvitationCode({ email, roleId }: InviteUserDto) {
    const user = await this.userRepo.findOneBy({ email });
    if (user) throw new UserAlreadyExistsException();

    const code = await this.codeService.setCode({
      type: CodeTypeEnum.USER_INVITATION,
      key: email,
      data: { roleId },
    });
    await this.userInvitationMailingService.send({ code, email });
  }

  async deleteUsers(ids: string[]) {
    await this.userRepo.delete({ id: In(ids) });
  }
}
