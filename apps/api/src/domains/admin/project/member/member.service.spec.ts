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
import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { SortMethodEnum } from '@/common/enums';
import { NotAllowedDomainException } from '@/domains/admin/user/exceptions';
import { UserService } from '@/domains/admin/user/user.service';
import { TestConfig } from '@/test-utils/util-functions';
import { MemberServiceProviders } from '../../../../test-utils/providers/member.service.providers';
import { TenantEntity } from '../../tenant/tenant.entity';
import type { RoleEntity } from '../role/role.entity';
import { RoleService } from '../role/role.service';
import { CreateMemberDto, UpdateMemberDto } from './dtos';
import type { FindAllMembersDto } from './dtos';
import type { DeleteManyMemberRequestDto } from './dtos/requests/delete-many-member-request.dto';
import {
  MemberAlreadyExistsException,
  MemberNotFoundException,
  MemberUpdateRoleNotMatchedProjectException,
} from './exceptions';
import { MemberInvalidUserException } from './exceptions/member-invalid-user.exception';
import { MemberEntity } from './member.entity';
import { MemberService } from './member.service';

describe('MemberService test suite', () => {
  let memberService: MemberService;
  let memberRepo: Repository<MemberEntity>;
  let tenantRepo: Repository<TenantEntity>;
  let userService: UserService;
  let roleService: RoleService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: MemberServiceProviders,
    }).compile();

    memberService = module.get<MemberService>(MemberService);
    memberRepo = module.get(getRepositoryToken(MemberEntity));
    tenantRepo = module.get(getRepositoryToken(TenantEntity));
    userService = module.get<UserService>(UserService);
    roleService = module.get<RoleService>(RoleService);
  });

  describe('create', () => {
    const projectId = faker.number.int();
    const roleId = faker.number.int();
    const userId = faker.number.int();
    let dto: CreateMemberDto;
    beforeEach(() => {
      dto = new CreateMemberDto();
      dto.roleId = roleId;
      dto.userId = userId;
    });

    it('creating a member succeeds with valid inputs', async () => {
      jest.spyOn(roleService, 'findById').mockResolvedValue({
        project: { id: projectId },
      } as RoleEntity);
      jest.spyOn(userService, 'findById').mockResolvedValue({} as any);
      jest.spyOn(memberRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(memberRepo, 'save').mockResolvedValue({} as MemberEntity);

      await memberService.create(dto);

      expect(roleService.findById).toHaveBeenCalledWith(roleId);
      expect(userService.findById).toHaveBeenCalledWith(userId);
      expect(memberRepo.findOne).toHaveBeenCalledTimes(1);
      expect(memberRepo.save).toHaveBeenCalledTimes(1);
    });

    it('creating a member fails with an existent member', async () => {
      jest.spyOn(roleService, 'findById').mockResolvedValue({
        project: { id: projectId },
      } as RoleEntity);
      jest.spyOn(userService, 'findById').mockResolvedValue({} as any);
      jest.spyOn(memberRepo, 'findOne').mockResolvedValue({} as MemberEntity);
      jest.spyOn(memberRepo, 'save');

      await expect(memberService.create(dto)).rejects.toThrow(
        MemberAlreadyExistsException,
      );

      expect(roleService.findById).toHaveBeenCalledWith(roleId);
      expect(userService.findById).toHaveBeenCalledWith(userId);
      expect(memberRepo.findOne).toHaveBeenCalledTimes(1);
      expect(memberRepo.save).not.toHaveBeenCalled();
    });

    it('creating a member fails with invalid user', async () => {
      jest.spyOn(roleService, 'findById').mockResolvedValue({
        project: { id: projectId },
      } as RoleEntity);
      jest
        .spyOn(userService, 'findById')
        .mockRejectedValue(new Error('User not found'));
      jest.spyOn(memberRepo, 'findOne');
      jest.spyOn(memberRepo, 'save');

      await expect(memberService.create(dto)).rejects.toThrow(
        MemberInvalidUserException,
      );

      expect(roleService.findById).toHaveBeenCalledWith(roleId);
      expect(userService.findById).toHaveBeenCalledWith(userId);
      expect(memberRepo.findOne).not.toHaveBeenCalled();
      expect(memberRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('createMany', () => {
    const projectId = faker.number.int();
    const memberCount = faker.number.int({ min: 2, max: 10 });
    const members = Array.from({ length: memberCount }).map(() => ({
      roleId: faker.number.int(),
      userId: faker.number.int(),
    }));
    let dtos: CreateMemberDto[];
    beforeEach(() => {
      dtos = members;
    });

    it('creating members succeeds with valid inputs', async () => {
      jest.spyOn(roleService, 'findById').mockResolvedValue({
        project: { id: projectId },
      } as RoleEntity);
      jest.spyOn(userService, 'findById').mockResolvedValue({} as any);
      jest.spyOn(memberRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(memberRepo, 'save').mockResolvedValue([] as any);

      await memberService.createMany(dtos);

      expect(roleService.findById).toHaveBeenCalledTimes(memberCount);
      expect(userService.findById).toHaveBeenCalledTimes(memberCount);
      expect(memberRepo.findOne).toHaveBeenCalledTimes(memberCount);
      expect(memberRepo.save).toHaveBeenCalledTimes(1);
    });

    it('creating members fails with an existent member', async () => {
      jest.spyOn(roleService, 'findById').mockResolvedValue({
        project: { id: projectId },
      } as RoleEntity);
      jest.spyOn(userService, 'findById').mockResolvedValue({} as any);
      jest.spyOn(memberRepo, 'findOne').mockResolvedValue({} as MemberEntity);
      jest.spyOn(memberRepo, 'save');

      await expect(memberService.createMany(dtos)).rejects.toThrow(
        MemberAlreadyExistsException,
      );

      expect(roleService.findById).toHaveBeenCalledTimes(1);
      expect(userService.findById).toHaveBeenCalledTimes(1);
      expect(memberRepo.findOne).toHaveBeenCalledTimes(1);
      expect(memberRepo.save).not.toHaveBeenCalled();
    });

    it('creating members fails with invalid user', async () => {
      jest.spyOn(roleService, 'findById').mockResolvedValue({
        project: { id: projectId },
      } as RoleEntity);
      jest
        .spyOn(userService, 'findById')
        .mockRejectedValue(new Error('User not found'));
      jest.spyOn(memberRepo, 'findOne');
      jest.spyOn(memberRepo, 'save');

      await expect(memberService.createMany(dtos)).rejects.toThrow(
        MemberInvalidUserException,
      );

      expect(roleService.findById).toHaveBeenCalledTimes(1);
      expect(userService.findById).toHaveBeenCalledTimes(1);
      expect(memberRepo.findOne).not.toHaveBeenCalled();
      expect(memberRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const projectId = faker.number.int();
    const roleId = faker.number.int();
    const memberId = faker.number.int();
    let dto: UpdateMemberDto;
    beforeEach(() => {
      dto = new UpdateMemberDto();
      dto.roleId = roleId;
      dto.memberId = memberId;
    });

    it('updating a member succeeds with valid inputs', async () => {
      const newRoleId = faker.number.int();
      const role = {
        project: { id: projectId },
        id: newRoleId,
      } as RoleEntity;
      const member = {
        id: memberId,
        role: { id: roleId, project: { id: projectId } },
      } as MemberEntity;

      jest.spyOn(roleService, 'findById').mockResolvedValue(role);
      jest.spyOn(memberRepo, 'findOne').mockResolvedValue(member);
      jest.spyOn(memberRepo, 'save').mockResolvedValue({} as MemberEntity);

      await memberService.update(dto);

      expect(roleService.findById).toHaveBeenCalledWith(roleId);
      expect(memberRepo.findOne).toHaveBeenCalledWith({
        where: { id: memberId },
        relations: { role: { project: true } },
      });
      expect(memberRepo.save).toHaveBeenCalledTimes(1);
    });

    it('updating a member fails with a nonexistent member', async () => {
      jest.spyOn(roleService, 'findById').mockResolvedValue({
        project: { id: projectId },
      } as RoleEntity);
      jest.spyOn(memberRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(memberRepo, 'save');

      await expect(memberService.update(dto)).rejects.toThrow(
        MemberNotFoundException,
      );

      expect(roleService.findById).toHaveBeenCalledWith(roleId);
      expect(memberRepo.findOne).toHaveBeenCalledTimes(1);
      expect(memberRepo.save).not.toHaveBeenCalled();
    });

    it('updating a member fails with not matching project', async () => {
      jest.spyOn(roleService, 'findById').mockResolvedValue({
        project: { id: projectId },
      } as RoleEntity);
      jest.spyOn(memberRepo, 'findOne').mockResolvedValue({
        role: { id: roleId, project: { id: faker.number.int() } },
      } as MemberEntity);
      jest.spyOn(memberRepo, 'save');

      await expect(memberService.update(dto)).rejects.toThrow(
        MemberUpdateRoleNotMatchedProjectException,
      );

      expect(roleService.findById).toHaveBeenCalledWith(roleId);
      expect(memberRepo.findOne).toHaveBeenCalledTimes(1);
      expect(memberRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('validateEmail', () => {
    it('validates email successfully when no tenants exist', async () => {
      jest.spyOn(tenantRepo, 'find').mockResolvedValue([]);

      const result = await memberService.validateEmail('test@example.com');

      expect(result).toBe(true);
      expect(tenantRepo.find).toHaveBeenCalledTimes(1);
    });

    it('validates email successfully when tenant has no allowDomains', async () => {
      const tenant = { allowDomains: null } as TenantEntity;
      jest.spyOn(tenantRepo, 'find').mockResolvedValue([tenant]);

      const result = await memberService.validateEmail('test@example.com');

      expect(result).toBe(true);
      expect(tenantRepo.find).toHaveBeenCalledTimes(1);
    });

    it('validates email successfully when tenant has empty allowDomains', async () => {
      const tenant = { allowDomains: [] } as unknown as TenantEntity;
      jest.spyOn(tenantRepo, 'find').mockResolvedValue([tenant]);

      const result = await memberService.validateEmail('test@example.com');

      expect(result).toBe(true);
      expect(tenantRepo.find).toHaveBeenCalledTimes(1);
    });

    it('validates email successfully when domain is allowed', async () => {
      const tenant = {
        allowDomains: ['example.com', 'test.com'],
      } as TenantEntity;
      jest.spyOn(tenantRepo, 'find').mockResolvedValue([tenant]);

      const result = await memberService.validateEmail('test@example.com');

      expect(result).toBe(true);
      expect(tenantRepo.find).toHaveBeenCalledTimes(1);
    });

    it('validates email fails when domain is not allowed', async () => {
      const tenant = {
        allowDomains: ['example.com', 'test.com'],
      } as TenantEntity;
      jest.spyOn(tenantRepo, 'find').mockResolvedValue([tenant]);

      await expect(
        memberService.validateEmail('test@forbidden.com'),
      ).rejects.toThrow(NotAllowedDomainException);

      expect(tenantRepo.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByProjectId', () => {
    const projectId = faker.number.int();
    const sort = { createdAt: SortMethodEnum.ASC };

    it('finds members by project id successfully', async () => {
      const members = [
        { id: 1, role: { id: 1 }, user: { id: 1 } },
        { id: 2, role: { id: 2 }, user: { id: 2 } },
      ] as MemberEntity[];
      const total = 2;

      jest
        .spyOn(memberRepo, 'findAndCount')
        .mockResolvedValue([members, total]);

      const result = await memberService.findByProjectId({ projectId, sort });

      expect(result).toEqual({ members, total });
      expect(memberRepo.findAndCount).toHaveBeenCalledWith({
        where: { role: { project: { id: projectId } } },
        order: { createdAt: sort.createdAt },
        relations: { role: true, user: true },
      });
    });

    it('finds members by project id with DESC sort', async () => {
      const sortDesc = { createdAt: SortMethodEnum.DESC };
      const members = [] as MemberEntity[];
      const total = 0;

      jest
        .spyOn(memberRepo, 'findAndCount')
        .mockResolvedValue([members, total]);

      const result = await memberService.findByProjectId({
        projectId,
        sort: sortDesc,
      });

      expect(result).toEqual({ members, total });
      expect(memberRepo.findAndCount).toHaveBeenCalledWith({
        where: { role: { project: { id: projectId } } },
        order: { createdAt: sortDesc.createdAt },
        relations: { role: true, user: true },
      });
    });
  });

  describe('findAll', () => {
    const projectId = faker.number.int();
    const page = 1;
    const limit = 10;

    it('finds all members with basic parameters', async () => {
      const items = [
        { id: 1, role: { id: 1 }, user: { id: 1 } },
        { id: 2, role: { id: 2 }, user: { id: 2 } },
      ] as MemberEntity[];
      const total = 2;

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(items),
        getCount: jest.fn().mockResolvedValue(total),
      };

      jest
        .spyOn(memberRepo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const dto: FindAllMembersDto = {
        projectId,
        options: { page, limit },
      };

      const result = await memberService.findAll(dto);

      expect(result).toEqual({
        items,
        meta: {
          itemCount: items.length,
          totalItems: total,
          itemsPerPage: limit,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
        },
      });
    });

    it('finds all members with queries and AND operator', async () => {
      const items = [] as MemberEntity[];
      const total = 0;

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(items),
        getCount: jest.fn().mockResolvedValue(total),
      };

      jest
        .spyOn(memberRepo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const dto: FindAllMembersDto = {
        projectId,
        options: { page, limit },
        queries: [
          { key: 'name', value: 'John', condition: 'IS' as any },
          {
            key: 'email',
            value: 'john@example.com',
            condition: 'CONTAINS' as any,
          },
        ],
        operator: 'AND',
      };

      const result = await memberService.findAll(dto);

      expect(result).toEqual({
        items,
        meta: {
          itemCount: items.length,
          totalItems: total,
          itemsPerPage: limit,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
        },
      });
    });

    it('finds all members with queries and OR operator', async () => {
      const items = [] as MemberEntity[];
      const total = 0;

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        offset: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(items),
        getCount: jest.fn().mockResolvedValue(total),
      };

      jest
        .spyOn(memberRepo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const dto: FindAllMembersDto = {
        projectId,
        options: { page, limit },
        queries: [{ key: 'role', value: 'admin', condition: 'IS' as any }],
        operator: 'OR',
      };

      const result = await memberService.findAll(dto);

      expect(result).toEqual({
        items,
        meta: {
          itemCount: items.length,
          totalItems: total,
          itemsPerPage: limit,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
        },
      });
    });
  });

  describe('delete', () => {
    const memberId = faker.number.int();

    it('deletes a member successfully', async () => {
      jest.spyOn(memberRepo, 'remove').mockResolvedValue({} as MemberEntity);

      await memberService.delete(memberId);

      expect(memberRepo.remove).toHaveBeenCalledWith(
        expect.objectContaining({ id: memberId }),
      );
    });
  });

  describe('deleteMany', () => {
    const memberIds = [
      faker.number.int(),
      faker.number.int(),
      faker.number.int(),
    ];
    const dto: DeleteManyMemberRequestDto = { memberIds };

    it('deletes multiple members successfully', async () => {
      const mockQueryBuilder = {
        delete: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ affected: memberIds.length }),
      };

      jest
        .spyOn(memberRepo, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      await memberService.deleteMany(dto);

      expect(memberRepo.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.delete).toHaveBeenCalledTimes(1);
      expect(mockQueryBuilder.from).toHaveBeenCalledWith(MemberEntity);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('id IN (:...ids)', {
        ids: memberIds,
      });
      expect(mockQueryBuilder.execute).toHaveBeenCalledTimes(1);
    });
  });
});
