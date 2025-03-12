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
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { QueryV2ConditionsEnum } from '@/common/enums';
import { NotAllowedDomainException } from '@/domains/admin/user/exceptions';
import { UserService } from '@/domains/admin/user/user.service';
import { TenantEntity } from '../../tenant/tenant.entity';
import { RoleService } from '../role/role.service';
import type { FindAllMembersDto, FindByProjectIdDto } from './dtos';
import { CreateMemberDto, UpdateMemberDto } from './dtos';
import { DeleteManyMemberRequestDto } from './dtos/requests/delete-many-member-request.dto';
import {
  MemberAlreadyExistsException,
  MemberNotFoundException,
  MemberUpdateRoleNotMatchedProjectException,
} from './exceptions';
import { MemberInvalidUserException } from './exceptions/member-invalid-user.exception';
import { MemberEntity } from './member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly repository: Repository<MemberEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepo: Repository<TenantEntity>,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly configService: ConfigService,
  ) {}

  private async validateMember(userId: number, roleId: number) {
    const role = await this.roleService.findById(roleId);

    try {
      await this.userService.findById(userId);
    } catch {
      throw new MemberInvalidUserException();
    }

    const member = await this.repository.findOne({
      where: {
        user: { id: userId },
        role: { project: { id: role.project.id } },
      },
      select: { id: true },
    });
    if (member) throw new MemberAlreadyExistsException();
  }

  async validateEmail(email: string) {
    const tenants = await this.tenantRepo.find();
    if (tenants.length === 0) return true;

    const tenant = {
      ...tenants[0],
    };
    const domain = email.split('@')[1];

    if (
      tenant.allowDomains &&
      tenant.allowDomains.length > 0 &&
      !tenant.allowDomains.includes(domain)
    ) {
      throw new NotAllowedDomainException();
    }
    return true;
  }

  async findByProjectId({ projectId, sort }: FindByProjectIdDto) {
    const [members, total] = await this.repository.findAndCount({
      where: { role: { project: { id: projectId } } },
      order: { createdAt: sort.createdAt },
      relations: { role: true, user: true },
    });
    return { members, total };
  }

  async findAll(dto: FindAllMembersDto) {
    const { projectId, queries = [], operator = 'AND' } = dto;
    const page = Number(dto.options.page);
    const limit = Number(dto.options.limit);

    const queryBuilder = this.repository
      .createQueryBuilder('members')
      .leftJoinAndSelect('members.role', 'role')
      .leftJoinAndSelect('members.user', 'user');

    queryBuilder.andWhere('role.project_id = :projectId', { projectId });

    const createdAtCondition = queries.find((query) => query.createdAt);
    if (createdAtCondition?.createdAt) {
      const { gte, lt } = createdAtCondition.createdAt;
      queryBuilder.andWhere('members.created_at >= :gte', { gte });
      queryBuilder.andWhere('members.created_at < :lt', { lt });
    }

    const method = operator === 'AND' ? 'andWhere' : 'orWhere';

    queryBuilder.andWhere(
      new Brackets((qb) => {
        let paramIndex = 0;
        for (const query of queries) {
          const { condition } = query;
          for (const [fieldKey, value] of Object.entries(query)) {
            if (fieldKey === 'condition' || fieldKey === 'createdAt') continue;

            const paramName = `value${paramIndex++}`;

            if (fieldKey === 'role') {
              qb[method](
                `role.name ${condition === QueryV2ConditionsEnum.IS ? '=' : 'LIKE'} :${paramName}`,
                {
                  [paramName]:
                    condition === QueryV2ConditionsEnum.IS ?
                      value
                    : `%${value?.toString()}%`,
                },
              );
            } else if (fieldKey === 'name') {
              qb[method](
                `user.name ${condition === QueryV2ConditionsEnum.IS ? '=' : 'LIKE'} :${paramName}`,
                {
                  [paramName]:
                    condition === QueryV2ConditionsEnum.IS ?
                      value
                    : `%${value?.toString()}%`,
                },
              );
            } else if (fieldKey === 'email') {
              qb[method](
                `user.email ${condition === QueryV2ConditionsEnum.IS ? '=' : 'LIKE'} :${paramName}`,
                {
                  [paramName]:
                    condition === QueryV2ConditionsEnum.IS ?
                      value
                    : `%${value?.toString()}%`,
                },
              );
            } else if (fieldKey === 'department') {
              qb[method](
                `user.department ${condition === QueryV2ConditionsEnum.IS ? '=' : 'LIKE'} :${paramName}`,
                {
                  [paramName]:
                    condition === QueryV2ConditionsEnum.IS ?
                      value
                    : `%${value?.toString()}%`,
                },
              );
            }
          }
        }
      }),
    );

    const items = await queryBuilder
      .offset((page - 1) * limit)
      .limit(limit)
      .getMany();

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

  @Transactional()
  async create({ roleId, userId }: CreateMemberDto) {
    await this.validateMember(userId, roleId);

    const newMember = MemberEntity.from({ roleId, userId });

    return await this.repository.save(newMember);
  }

  @Transactional()
  async createMany(members: CreateMemberDto[]) {
    for (const { roleId, userId } of members) {
      await this.validateMember(userId, roleId);
    }

    const newMembers = members.map(({ roleId, userId }) =>
      MemberEntity.from({ roleId, userId }),
    );

    return await this.repository.save(newMembers);
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

  @Transactional()
  async deleteMany(members: DeleteManyMemberRequestDto) {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from(MemberEntity)
      .where('id IN (:...ids)', { ids: members.memberIds })
      .execute();
  }
}
