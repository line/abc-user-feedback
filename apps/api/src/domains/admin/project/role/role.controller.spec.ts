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
import { DataSource } from 'typeorm';

import {
  getMockProvider,
  getRandomEnumValue,
  MockDataSource,
} from '@/test-utils/util-functions';
import { CreateRoleDto, UpdateRoleDto } from './dtos';
import { PermissionEnum } from './permission.enum';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';

const MockRoleService = {
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  findByProjectId: jest.fn(),
  deleteById: jest.fn(),
};

describe('Role Controller', () => {
  let controller: RoleController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        getMockProvider(RoleService, MockRoleService),
        getMockProvider(DataSource, MockDataSource),
      ],
      controllers: [RoleController],
    }).compile();
    controller = module.get(RoleController);
  });

  it('to be defined', () => {
    expect(controller).toBeDefined();
  });
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('getAllRolesByProjectId', async () => {
    const total = faker.number.int({ min: 0, max: 10 });
    const roles = Array.from({ length: total }).map(() => ({
      _id: faker.number.int(),
      id: faker.number.int(),
      name: faker.string.sample(),
      permissions: [getRandomEnumValue(PermissionEnum)],
      __v: faker.number.int({ max: 100, min: 0 }),
      [faker.string.sample()]: faker.string.sample(),
    }));
    const projectId = faker.number.int();
    jest.spyOn(MockRoleService, 'findByProjectId').mockResolvedValue({
      roles,
      total,
    });

    const res = await controller.getAllRolesByProjectId(projectId);

    expect(MockRoleService.findByProjectId).toHaveBeenCalledTimes(1);
    expect(res).toEqual({
      total,
      roles: roles.map(({ id, name, permissions }) => ({
        id,
        name,
        permissions,
      })),
    });
  });

  it('createRole', async () => {
    const dto = new CreateRoleDto();
    const projectId = faker.number.int();

    await controller.createRole(projectId, dto);

    expect(MockRoleService.create).toHaveBeenCalledTimes(1);
    expect(MockRoleService.create).toHaveBeenCalledWith({ ...dto, projectId });
  });

  it('updateRole', async () => {
    const dto = new UpdateRoleDto();
    const id = faker.number.int();
    const projectId = faker.number.int();

    await controller.updateRole(projectId, id, dto);

    expect(MockRoleService.update).toHaveBeenCalledTimes(1);
    expect(MockRoleService.update).toHaveBeenCalledWith(id, projectId, dto);
  });

  it('deleteRole', async () => {
    const id = faker.number.int();

    await controller.deleteRole(id);

    expect(MockRoleService.deleteById).toHaveBeenCalledTimes(1);
    expect(MockRoleService.deleteById).toHaveBeenCalledWith(id);
  });
});
