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
import { Not, Repository } from 'typeorm';

import { getRandomEnumValues, mockRepository } from '@/utils/test-utils';

import { CreateRoleDto, UpdateRoleDto } from './dtos';
import {
  RoleAlreadyExistsException,
  RoleNotFoundException,
} from './exceptions';
import { PermissionEnum } from './permission.enum';
import { RoleEntity } from './role.entity';
import { RoleService } from './role.service';

export const RoleServiceProviders = [
  RoleService,
  {
    provide: getRepositoryToken(RoleEntity),
    useValue: mockRepository(),
  },
];

describe('RoleService', () => {
  let roleService: RoleService;
  let roleRepo: Repository<RoleEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: RoleServiceProviders,
    }).compile();
    roleService = module.get(RoleService);
    roleRepo = module.get(getRepositoryToken(RoleEntity));
  });

  describe('create', () => {
    it('creating a role succeeds with valid inputs', async () => {
      const dto = new CreateRoleDto();
      dto.name = faker.datatype.string();
      dto.permissions = getRandomEnumValues(PermissionEnum);
      dto.projectId = faker.datatype.number();
      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValue(null);

      await roleService.create(dto);

      expect(roleRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(roleRepo.findOneBy).toHaveBeenCalledWith({
        name: dto.name,
        project: { id: dto.projectId },
      });
      expect(roleRepo.save).toHaveBeenCalledTimes(1);
      expect(roleRepo.save).toHaveBeenCalledWith({
        name: dto.name,
        permissions: dto.permissions,
        project: { id: dto.projectId },
      });
    });
    it('creating a role fails with duplicate inputs', async () => {
      const dto = new CreateRoleDto();
      dto.name = faker.datatype.string();
      dto.permissions = getRandomEnumValues(PermissionEnum);
      dto.projectId = faker.datatype.number();
      jest
        .spyOn(roleRepo, 'findOneBy')
        .mockResolvedValue({ id: faker.datatype.number() } as RoleEntity);

      await expect(roleService.create(dto)).rejects.toThrow(
        RoleAlreadyExistsException,
      );

      expect(roleRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(roleRepo.findOneBy).toHaveBeenCalledWith({
        name: dto.name,
        project: { id: dto.projectId },
      });
    });
  });

  describe('update', () => {
    it('updating a role succeeds with valid inputs', async () => {
      const roleId = faker.datatype.number();
      const projectId = faker.datatype.number();
      const dto = new UpdateRoleDto();
      dto.name = faker.datatype.string();
      dto.permissions = getRandomEnumValues(PermissionEnum);
      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValue(null);

      await roleService.update(roleId, projectId, dto);

      expect(roleRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(roleRepo.findOneBy).toHaveBeenCalledWith({
        name: dto.name,
        project: { id: projectId },
        id: Not(roleId),
      });
      expect(roleRepo.update).toHaveBeenCalledTimes(1);
      expect(roleRepo.update).toHaveBeenCalledWith(roleId, {
        id: roleId,
        name: dto.name,
        permissions: dto.permissions,
      });
    });
    it('updating a role succeeds with a duplicate name', async () => {
      const roleId = faker.datatype.number();
      const projectId = faker.datatype.number();
      const dto = new UpdateRoleDto();
      dto.name = faker.datatype.string();
      dto.permissions = getRandomEnumValues(PermissionEnum);
      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValue({
        id: faker.datatype.number(),
        name: dto.name,
      } as RoleEntity);

      await expect(roleService.update(roleId, projectId, dto)).rejects.toThrow(
        RoleAlreadyExistsException,
      );

      expect(roleRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(roleRepo.findOneBy).toHaveBeenCalledWith({
        name: dto.name,
        project: { id: projectId },
        id: Not(roleId),
      });
    });
  });

  describe('findById', () => {
    it('finding a role succeeds with a valid role id', async () => {
      const roleId = faker.datatype.number();
      jest
        .spyOn(roleRepo, 'findOne')
        .mockResolvedValue({ id: roleId } as RoleEntity);

      const result = await roleService.findById(roleId);

      expect(roleRepo.findOne).toHaveBeenCalledTimes(1);
      expect(roleRepo.findOne).toHaveBeenCalledWith({
        where: { id: roleId },
        relations: { project: true },
      });
      expect(result.id).toEqual(roleId);
    });
    it('finding a role fails with a nonexistent role id', async () => {
      const nonexistentRoleId = faker.datatype.number();
      jest.spyOn(roleRepo, 'findOne').mockResolvedValue(null);

      await expect(roleService.findById(nonexistentRoleId)).rejects.toThrow(
        RoleNotFoundException,
      );

      expect(roleRepo.findOne).toHaveBeenCalledTimes(1);
      expect(roleRepo.findOne).toHaveBeenCalledWith({
        where: { id: nonexistentRoleId },
        relations: { project: true },
      });
    });
  });

  describe('findByProjectNameAndRoleName', () => {
    it('finding a role succeeds with a valid project name and a role name', async () => {
      const roleId = faker.datatype.number();
      const projectName = faker.datatype.string();
      const roleName = faker.datatype.string();
      jest
        .spyOn(roleRepo, 'findOne')
        .mockResolvedValue({ id: roleId } as RoleEntity);

      const result = await roleService.findByProjectNameAndRoleName(
        projectName,
        roleName,
      );

      expect(roleRepo.findOne).toHaveBeenCalledTimes(1);
      expect(roleRepo.findOne).toHaveBeenCalledWith({
        where: { project: { name: projectName }, name: roleName },
        relations: { project: true },
      });
      expect(result.id).toEqual(roleId);
    });
    it('finding a role fails with an invalid project name and an invalid role name', async () => {
      const projectName = faker.datatype.string();
      const roleName = faker.datatype.string();
      jest.spyOn(roleRepo, 'findOne').mockResolvedValue(null);

      await expect(
        roleService.findByProjectNameAndRoleName(projectName, roleName),
      ).rejects.toThrow(RoleNotFoundException);

      expect(roleRepo.findOne).toHaveBeenCalledTimes(1);
      expect(roleRepo.findOne).toHaveBeenCalledWith({
        where: { project: { name: projectName }, name: roleName },
        relations: { project: true },
      });
    });
  });
});
