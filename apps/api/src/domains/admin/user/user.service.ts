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
import { Brackets, In, Repository, SelectQueryBuilder } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { UserInvitationMailingService } from '@/shared/mailing/user-invitation-mailing.service';

import { QueryV2ConditionsEnum } from '@/common/enums';
import { CodeTypeEnum } from '../../../shared/code/code-type.enum';
import { CodeService } from '../../../shared/code/code.service';
import type { FindAllUsersDto } from './dtos';
import { InviteUserDto } from './dtos';
import { UpdateUserDto } from './dtos/update-user.dto';
import type { SignUpMethodEnum } from './entities/enums';
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
    private readonly userInvitationMailingService: UserInvitationMailingService,
    private readonly codeService: CodeService,
  ) {}

  async findAll(dto: FindAllUsersDto) {
    const { queries = [], operator = 'AND', order } = dto;
    const page = Number(dto.options.page);
    const limit = Number(dto.options.limit);

    const queryBuilder = this.userRepo
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.members', 'members')
      .leftJoinAndSelect('members.role', 'role')
      .leftJoinAndSelect('role.project', 'project');

    const createdAtCondition = queries.find((query) => query.createdAt);
    if (createdAtCondition?.createdAt) {
      const { gte, lt } = createdAtCondition.createdAt;
      queryBuilder.andWhere('users.created_at >= :gte', { gte });
      queryBuilder.andWhere('users.created_at < :lt', { lt });
    }

    const method = operator === 'AND' ? 'andWhere' : 'orWhere';

    queryBuilder.andWhere(
      new Brackets((qb) => {
        let paramIndex = 0;
        for (const query of queries) {
          const { condition } = query;
          for (const [fieldKey, value] of Object.entries(query)) {
            if (fieldKey === 'condition') continue;

            const paramName = `value${paramIndex++}`;

            if (fieldKey === 'type') {
              qb[method](`users.type IN (:...${paramName})`, {
                [paramName]: value,
              });
            } else if (fieldKey === 'projectId') {
              qb[method](`project.id IN (:...${paramName})`, {
                [paramName]: value,
              });
            } else if (['email', 'name', 'department'].includes(fieldKey)) {
              const operator =
                condition === QueryV2ConditionsEnum.IS ? '=' : 'LIKE';
              const valueFormat =
                condition === QueryV2ConditionsEnum.IS ?
                  value?.toString().toLowerCase()
                : `%${value?.toString().toLowerCase()}%`;
              qb[method](`LOWER(users.${fieldKey}) ${operator} :${paramName}`, {
                [paramName]: valueFormat,
              });
            }
          }
        }
      }),
    );
    if (order?.createdAt) {
      queryBuilder.addOrderBy(`users.createdAt`, order.createdAt);
    }

    if ('skip' in queryBuilder) {
      queryBuilder.skip((page - 1) * limit).take(limit);
    }
    // Handle the case where offset is used in jest
    else if ('offset' in queryBuilder) {
      (queryBuilder as SelectQueryBuilder<UserEntity>)
        .offset((page - 1) * limit)
        .limit(limit);
    }
    const items = await queryBuilder.getMany();

    const total = await queryBuilder.getCount();

    return {
      items,
      meta: {
        itemCount: items.length,
        totalItems: total,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
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
      data: { roleId: roleId ?? 0, userType, invitedBy },
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

  async findRolesById(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      select: { members: true },
      relations: { members: { role: { project: true } } },
    });
    if (user === null) {
      throw new UserNotFoundException();
    }
    const { members } = user;
    return members.map((v) => v.role);
  }
}
