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
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import {
  TestConfigs,
  clearEntities,
  getRandomEnumValues,
} from '@/utils/test-utils';

import { CreateRoleDto, UpdateRoleDto } from './dtos';
import { RoleNotFoundException } from './exceptions';
import { PermissionEnum } from './permission.enum';
import { DefaultRole } from './role.constant';
import { RoleEntity } from './role.entity';
import { RoleService } from './role.service';

describe('role service', () => {
  let roleService: RoleService;

  let dataSource: DataSource;
  let roleRepo: Repository<RoleEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [...TestConfigs, TypeOrmModule.forFeature([RoleEntity])],
      providers: [RoleService],
    }).compile();
    roleService = module.get(RoleService);

    dataSource = module.get(DataSource);
    roleRepo = dataSource.getRepository(RoleEntity);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    await clearEntities([roleRepo]);
  });

  describe('create role', () => {
    it('positive case', async () => {
      const dto = new CreateRoleDto();
      dto.name = 'test';
      dto.permissions = [PermissionEnum.RoleManagement];

      const { id } = await roleService.createRole(dto);

      const role = await roleRepo.findOneBy({ id });
      expect(role.name).toEqual(dto.name);
      expect(role.permissions).toEqual(dto.permissions);
    });
  });

  describe('update role', () => {
    let role: RoleEntity;
    beforeEach(async () => {
      role = await roleRepo.save({
        name: faker.datatype.string(),
        permissions: getRandomEnumValues(PermissionEnum),
      });
    });

    it('positive case', async () => {
      const dto = new UpdateRoleDto();
      dto.name = 'test2';
      dto.permissions = [PermissionEnum.RoleManagement];
      await roleService.updateRole(role.id, dto);

      const updatedRole = await roleRepo.findOneBy({ id: role.id });
      expect(updatedRole.name).toEqual(dto.name);
      expect(updatedRole.permissions).toEqual(dto.permissions);
    });

    it('The owner role cannot be updated', async () => {
      const dto = new UpdateRoleDto();
      dto.name = DefaultRole.Owner;
      dto.permissions = [PermissionEnum.RoleManagement];
      await expect(roleService.updateRole(role.id, dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('find by id', () => {
    let role: RoleEntity;
    beforeEach(async () => {
      role = await roleRepo.save({
        name: faker.datatype.string(),
        permissions: getRandomEnumValues(PermissionEnum),
      });
    });

    it('positive case', async () => {
      const result = await roleService.findById(role.id);
      expect(result).toEqual(role);
    });

    it('Not found role', async () => {
      const notExistsId = faker.datatype.uuid();
      await expect(roleService.findById(notExistsId)).rejects.toThrow(
        RoleNotFoundException,
      );
    });
  });

  describe('find and count', () => {
    let roleEntities: RoleEntity[];

    beforeEach(async () => {
      roleEntities = await roleRepo.save(
        Array.from({ length: 50 }).map(() => ({
          name: faker.datatype.string(),
          permissions: getRandomEnumValues(PermissionEnum),
        })),
      );
    });

    it('positive case', async () => {
      const { total, roles } = await roleService.findAndCount();
      expect(roles).toHaveLength(roleEntities.length);
      expect(total).toEqual(roleEntities.length);
    });
  });

  describe('delete', () => {
    let targetRole: RoleEntity;

    beforeEach(async () => {
      targetRole = await roleRepo.save({
        name: faker.datatype.string(),
        permissions: getRandomEnumValues(PermissionEnum),
      });
    });

    it('positive case', async () => {
      await roleService.deleteById(targetRole.id);
      const res = await roleRepo.findOneBy({ id: targetRole.id });
      expect(res).toBeNull();
    });
  });
});
