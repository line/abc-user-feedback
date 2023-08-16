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

import {
  TestConfigs,
  getMockProvider,
  getRandomEnumValue,
} from '@/utils/test-utils';

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
      imports: [...TestConfigs],
      providers: [getMockProvider(RoleService, MockRoleService)],
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
    const total = faker.datatype.number({ min: 0, max: 10 });
    const roles = Array.from({ length: total }).map(() => ({
      _id: faker.datatype.number(),
      id: faker.datatype.number(),
      name: faker.datatype.string(),
      permissions: [getRandomEnumValue(PermissionEnum)],
      __v: faker.datatype.number({ max: 100, min: 0 }),
      [faker.datatype.string()]: faker.datatype.string(),
    }));
    const projectId = faker.datatype.number();
    jest.spyOn(MockRoleService, 'findByProjectId').mockResolvedValue({
      roles,
      total,
    });

    const res = await controller.getAllRolesByProjectId(projectId);

    expect(MockRoleService.findByProjectId).toBeCalledTimes(1);
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
    const projectId = faker.datatype.number();

    await controller.createRole(projectId, dto);

    expect(MockRoleService.create).toBeCalledTimes(1);
    expect(MockRoleService.create).toBeCalledWith({ ...dto, projectId });
  });

  it('updateRole', async () => {
    const dto = new UpdateRoleDto();
    const id = faker.datatype.number();
    const projectId = faker.datatype.number();

    await controller.updateRole(projectId, id, dto);

    expect(MockRoleService.update).toBeCalledTimes(1);
    expect(MockRoleService.update).toBeCalledWith(id, projectId, dto);
  });

  it('deleteRole', async () => {
    const id = faker.datatype.number();

    await controller.deleteRole(id);

    expect(MockRoleService.deleteById).toBeCalledTimes(1);
    expect(MockRoleService.deleteById).toBeCalledWith(id);
  });
});
