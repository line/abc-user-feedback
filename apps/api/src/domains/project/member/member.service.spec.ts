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
import { Repository } from 'typeorm';

import { mockRepository } from '@/utils/test-utils';

import { RoleEntity } from '../role/role.entity';
import { RoleServiceProviders } from '../role/role.service.spec';
import { CreateMemberDto, UpdateMemberDto } from './dtos';
import {
  MemberAlreadyExistsException,
  MemberNotFoundException,
  MemberUpdateRoleNotMatchedProjectException,
} from './exceptions';
import { MemberEntity } from './member.entity';
import { MemberService } from './member.service';

export const MemberServiceProviders = [
  MemberService,
  {
    provide: getRepositoryToken(MemberEntity),
    useValue: mockRepository(),
  },
  ...RoleServiceProviders,
];

describe('MemberService test suite', () => {
  let memberService: MemberService;
  let memberRepo: Repository<MemberEntity>;
  let roleRepo: Repository<RoleEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: MemberServiceProviders,
    }).compile();

    memberService = module.get<MemberService>(MemberService);
    memberRepo = module.get(getRepositoryToken(MemberEntity));
    roleRepo = module.get(getRepositoryToken(RoleEntity));
  });

  describe('create', () => {
    const projectId = faker.datatype.number();
    const roleId = faker.datatype.number();
    const userId = faker.datatype.number();
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

  describe('update', () => {
    const projectId = faker.datatype.number();
    const roleId = faker.datatype.number();
    const memberId = faker.datatype.number();
    let dto: UpdateMemberDto;
    beforeEach(() => {
      dto = new UpdateMemberDto();
      dto.roleId = roleId;
      dto.memberId = memberId;
    });

    it('updating a member succeeds with valid inputs', async () => {
      jest
        .spyOn(roleRepo, 'findOne')
        .mockResolvedValue({ project: { id: projectId } } as RoleEntity);
      jest.spyOn(memberRepo, 'findOne').mockResolvedValue({
        id: memberId,
        role: { id: roleId, project: { id: projectId } },
      } as MemberEntity);
      jest.spyOn(memberRepo, 'update');

      await memberService.update(dto);

      expect(roleRepo.findOne).toBeCalledTimes(1);
      expect(memberRepo.findOne).toBeCalledTimes(1);
      expect(memberRepo.update).toBeCalledTimes(1);
      expect(memberRepo.update).toBeCalledWith(memberId, {
        id: memberId,
        role: { project: { id: projectId } },
      });
    });
    it('updating a member fails with a nonexistent member', async () => {
      jest
        .spyOn(roleRepo, 'findOne')
        .mockResolvedValue({ project: { id: projectId } } as RoleEntity);
      jest.spyOn(memberRepo, 'findOne').mockResolvedValue(null as MemberEntity);
      jest.spyOn(memberRepo, 'update');

      await expect(memberService.update(dto)).rejects.toThrowError(
        MemberNotFoundException,
      );

      expect(roleRepo.findOne).toBeCalledTimes(1);
      expect(memberRepo.findOne).toBeCalledTimes(1);
      expect(memberRepo.update).not.toBeCalled();
    });
    it('updating a member fails with not matching inputs', async () => {
      jest
        .spyOn(roleRepo, 'findOne')
        .mockResolvedValue({ project: { id: projectId } } as RoleEntity);
      jest.spyOn(memberRepo, 'findOne').mockResolvedValue({
        role: { id: roleId, project: { id: faker.datatype.number() } },
      } as MemberEntity);
      jest.spyOn(memberRepo, 'update');

      await expect(memberService.update(dto)).rejects.toThrowError(
        MemberUpdateRoleNotMatchedProjectException,
      );

      expect(roleRepo.findOne).toBeCalledTimes(1);
      expect(memberRepo.findOne).toBeCalledTimes(1);
      expect(memberRepo.update).not.toBeCalled();
    });
  });
});
