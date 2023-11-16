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
import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { TestConfig } from '@/test-utils/util-functions';
import { MemberServiceProviders } from '../../../test-utils/providers/member.service.providers';
import { RoleEntity } from '../role/role.entity';
import { CreateMemberDto, UpdateMemberDto } from './dtos';
import {
  MemberAlreadyExistsException,
  MemberNotFoundException,
  MemberUpdateRoleNotMatchedProjectException,
} from './exceptions';
import { MemberEntity } from './member.entity';
import { MemberService } from './member.service';

describe('MemberService test suite', () => {
  let memberService: MemberService;
  let memberRepo: Repository<MemberEntity>;
  let roleRepo: Repository<RoleEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: MemberServiceProviders,
    }).compile();

    memberService = module.get<MemberService>(MemberService);
    memberRepo = module.get(getRepositoryToken(MemberEntity));
    roleRepo = module.get(getRepositoryToken(RoleEntity));
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
      jest
        .spyOn(roleRepo, 'findOne')
        .mockResolvedValue({ project: { id: projectId } } as RoleEntity);
      jest.spyOn(memberRepo, 'findOne').mockResolvedValue(null as MemberEntity);
      jest.spyOn(memberRepo, 'save');

      await memberService.create(dto);

      expect(roleRepo.findOne).toBeCalledTimes(1);
      expect(memberRepo.findOne).toBeCalledTimes(1);
      expect(memberRepo.save).toBeCalledTimes(1);
      expect(memberRepo.save).toBeCalledWith({
        role: { id: roleId },
        user: { id: userId },
      });
    });
    it('creating a member fails with an existent member', async () => {
      jest
        .spyOn(roleRepo, 'findOne')
        .mockResolvedValue({ project: { id: projectId } } as RoleEntity);
      jest.spyOn(memberRepo, 'findOne').mockResolvedValue({} as MemberEntity);
      jest.spyOn(memberRepo, 'save');

      await expect(memberService.create(dto)).rejects.toThrowError(
        MemberAlreadyExistsException,
      );

      expect(roleRepo.findOne).toBeCalledTimes(1);
      expect(memberRepo.findOne).toBeCalledTimes(1);
      expect(memberRepo.save).not.toBeCalled();
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
      jest
        .spyOn(roleRepo, 'findOne')
        .mockResolvedValue({ project: { id: projectId } } as RoleEntity);
      jest.spyOn(memberRepo, 'findOne').mockResolvedValue(null as MemberEntity);
      jest.spyOn(memberRepo, 'save');

      await memberService.createMany(dtos);

      expect(roleRepo.findOne).toBeCalledTimes(memberCount);
      expect(memberRepo.findOne).toBeCalledTimes(memberCount);
      expect(memberRepo.save).toBeCalledTimes(1);
      expect(memberRepo.save).toBeCalledWith(
        members.map(({ roleId, userId }) =>
          MemberEntity.from({ roleId, userId }),
        ),
      );
    });
    it('creating members fails with an existent member', async () => {
      jest
        .spyOn(roleRepo, 'findOne')
        .mockResolvedValue({ project: { id: projectId } } as RoleEntity);
      jest.spyOn(memberRepo, 'findOne').mockResolvedValue({} as MemberEntity);
      jest.spyOn(memberRepo, 'save');

      await expect(memberService.createMany(dtos)).rejects.toThrowError(
        MemberAlreadyExistsException,
      );

      expect(roleRepo.findOne).toBeCalledTimes(1);
      expect(memberRepo.findOne).toBeCalledTimes(1);
      expect(memberRepo.save).not.toBeCalled();
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
      jest.spyOn(roleRepo, 'findOne').mockResolvedValue({
        project: { id: projectId },
        id: newRoleId,
      } as RoleEntity);
      jest.spyOn(memberRepo, 'findOne').mockResolvedValue({
        id: memberId,
        role: { id: roleId, project: { id: projectId } },
      } as MemberEntity);
      jest.spyOn(memberRepo, 'save');

      await memberService.update(dto);

      expect(roleRepo.findOne).toBeCalledTimes(1);
      expect(memberRepo.findOne).toBeCalledTimes(1);
      expect(memberRepo.save).toBeCalledTimes(1);
      expect(memberRepo.save).toBeCalledWith({
        id: memberId,
        role: { id: newRoleId, project: { id: projectId } },
      });
    });
    it('updating a member fails with a nonexistent member', async () => {
      jest
        .spyOn(roleRepo, 'findOne')
        .mockResolvedValue({ project: { id: projectId } } as RoleEntity);
      jest.spyOn(memberRepo, 'findOne').mockResolvedValue(null as MemberEntity);
      jest.spyOn(memberRepo, 'save');

      await expect(memberService.update(dto)).rejects.toThrowError(
        MemberNotFoundException,
      );

      expect(roleRepo.findOne).toBeCalledTimes(1);
      expect(memberRepo.findOne).toBeCalledTimes(1);
      expect(memberRepo.save).not.toBeCalled();
    });
    it('updating a member fails with not matching inputs', async () => {
      jest
        .spyOn(roleRepo, 'findOne')
        .mockResolvedValue({ project: { id: projectId } } as RoleEntity);
      jest.spyOn(memberRepo, 'findOne').mockResolvedValue({
        role: { id: roleId, project: { id: faker.number.int() } },
      } as MemberEntity);
      jest.spyOn(memberRepo, 'save');

      await expect(memberService.update(dto)).rejects.toThrowError(
        MemberUpdateRoleNotMatchedProjectException,
      );

      expect(roleRepo.findOne).toBeCalledTimes(1);
      expect(memberRepo.findOne).toBeCalledTimes(1);
      expect(memberRepo.save).not.toBeCalled();
    });
  });
});
