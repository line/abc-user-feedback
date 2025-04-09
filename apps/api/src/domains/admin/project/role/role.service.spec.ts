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

import { roleFixture } from '@/test-utils/fixtures';
import { getRandomEnumValues, TestConfig } from '@/test-utils/util-functions';
import { RoleServiceProviders } from '../../../../test-utils/providers/role.service.providers';
import { CreateRoleDto, UpdateRoleDto } from './dtos';
import {
  RoleAlreadyExistsException,
  RoleNotFoundException,
} from './exceptions';
import { PermissionEnum } from './permission.enum';
import { RoleEntity } from './role.entity';
import { RoleService } from './role.service';

describe('RoleService', () => {
  let roleService: RoleService;
  let roleRepo: Repository<RoleEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: RoleServiceProviders,
    }).compile();
    roleService = module.get(RoleService);
    roleRepo = module.get(getRepositoryToken(RoleEntity));
  });

  describe('create', () => {
    it('creating a role succeeds with valid inputs', async () => {
      const dto = new CreateRoleDto();
      dto.name = faker.string.sample();
      dto.permissions = getRandomEnumValues(PermissionEnum);
      dto.projectId = faker.number.int();
      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValue(null);

      const role = await roleService.create(dto);

      expect(role.name).toEqual(dto.name);
      expect(role.permissions).toEqual(dto.permissions);
      expect(role.project.id).toEqual(dto.projectId);
    });
    it('creating a role fails with duplicate inputs', async () => {
      const dto = new CreateRoleDto();
      dto.name = faker.string.sample();
      dto.permissions = getRandomEnumValues(PermissionEnum);
      dto.projectId = faker.number.int();
      jest
        .spyOn(roleRepo, 'findOneBy')
        .mockResolvedValue({ id: faker.number.int() } as RoleEntity);

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

  describe('createMany', () => {
    const projectId = faker.number.int();
    const roleCount = faker.number.int({ min: 2, max: 10 });
    const roles = Array.from({ length: roleCount }).map(() => ({
      name: faker.string.sample(),
      permissions: getRandomEnumValues(PermissionEnum),
      projectId,
    }));
    let dtos: CreateRoleDto[];
    beforeEach(() => {
      dtos = roles;
    });

    it('creating roles succeeds with valid inputs', async () => {
      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValue(null);

      const roles = await roleService.createMany(dtos);

      expect(roles).toHaveLength(roleCount);
    });
    it('creating roles fails with duplicate inputs', async () => {
      await expect(roleService.createMany(dtos)).rejects.toThrow(
        RoleAlreadyExistsException,
      );
    });
  });

  describe('update', () => {
    it('updating a role succeeds with valid inputs', async () => {
      const roleId = faker.number.int();
      const projectId = faker.number.int();
      const dto = new UpdateRoleDto();
      dto.name = faker.string.sample();
      dto.permissions = getRandomEnumValues(PermissionEnum);
      jest.spyOn(roleRepo, 'findOne').mockResolvedValue(null);

      const role = await roleService.update(roleId, projectId, dto);

      expect(role.name).toEqual(dto.name);
      expect(role.permissions).toEqual(dto.permissions);
    });
    it('updating a role fails with a duplicate name', async () => {
      const roleId = faker.number.int();
      const projectId = faker.number.int();
      const dto = new UpdateRoleDto();
      dto.name = faker.string.sample();
      dto.permissions = getRandomEnumValues(PermissionEnum);

      await expect(roleService.update(roleId, projectId, dto)).rejects.toThrow(
        RoleAlreadyExistsException,
      );
    });
  });

  describe('findById', () => {
    it('finding a role succeeds with a valid role id', async () => {
      const roleId = roleFixture.id;

      const result = await roleService.findById(roleId);

      expect(result.id).toEqual(roleId);
    });
    it('finding a role fails with a nonexistent role id', async () => {
      const nonexistentRoleId = faker.number.int();
      jest.spyOn(roleRepo, 'findOne').mockResolvedValue(null);

      await expect(roleService.findById(nonexistentRoleId)).rejects.toThrow(
        RoleNotFoundException,
      );
    });
  });

  describe('findByProjectNameAndRoleName', () => {
    it('finding a role succeeds with a valid project name and a role name', async () => {
      const roleId = roleFixture.id;
      const projectName = faker.string.sample();
      const roleName = faker.string.sample();

      const result = await roleService.findByProjectNameAndRoleName(
        projectName,
        roleName,
      );

      expect(result.id).toEqual(roleId);
    });
    it('finding a role fails with an invalid project name and an invalid role name', async () => {
      const projectName = faker.string.sample();
      const roleName = faker.string.sample();
      jest.spyOn(roleRepo, 'findOne').mockResolvedValue(null);

      await expect(
        roleService.findByProjectNameAndRoleName(projectName, roleName),
      ).rejects.toThrow(RoleNotFoundException);
    });
  });
});
