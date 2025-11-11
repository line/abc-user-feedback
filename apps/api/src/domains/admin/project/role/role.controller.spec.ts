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
import {
  RoleAlreadyExistsException,
  RoleNotFoundException,
} from './exceptions';
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

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('to be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllRolesByProjectId', () => {
    it('should return all roles for a project successfully', async () => {
      const total = faker.number.int({ min: 1, max: 10 });
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
      expect(MockRoleService.findByProjectId).toHaveBeenCalledWith(projectId);
      expect(res).toEqual({
        total,
        roles: roles.map(({ id, name, permissions }) => ({
          id,
          name,
          permissions,
        })),
      });
    });

    it('should return empty result when no roles exist for project', async () => {
      const projectId = faker.number.int();
      jest.spyOn(MockRoleService, 'findByProjectId').mockResolvedValue({
        roles: [],
        total: 0,
      });

      const res = await controller.getAllRolesByProjectId(projectId);

      expect(MockRoleService.findByProjectId).toHaveBeenCalledTimes(1);
      expect(MockRoleService.findByProjectId).toHaveBeenCalledWith(projectId);
      expect(res).toEqual({
        total: 0,
        roles: [],
      });
    });

    it('should handle service errors properly', async () => {
      const projectId = faker.number.int();
      const error = new Error('Database connection failed');
      jest.spyOn(MockRoleService, 'findByProjectId').mockRejectedValue(error);

      await expect(
        controller.getAllRolesByProjectId(projectId),
      ).rejects.toThrow('Database connection failed');
      expect(MockRoleService.findByProjectId).toHaveBeenCalledTimes(1);
      expect(MockRoleService.findByProjectId).toHaveBeenCalledWith(projectId);
    });
  });

  describe('createRole', () => {
    it('should create a role successfully', async () => {
      const dto = new CreateRoleDto();
      dto.name = faker.string.sample();
      dto.permissions = [getRandomEnumValue(PermissionEnum)];
      const projectId = faker.number.int();

      jest.spyOn(MockRoleService, 'create').mockResolvedValue(undefined);

      await controller.createRole(projectId, dto);

      expect(MockRoleService.create).toHaveBeenCalledTimes(1);
      expect(MockRoleService.create).toHaveBeenCalledWith({
        ...dto,
        projectId,
      });
    });

    it('should throw RoleAlreadyExistsException when role name already exists', async () => {
      const dto = new CreateRoleDto();
      dto.name = faker.string.sample();
      dto.permissions = [getRandomEnumValue(PermissionEnum)];
      const projectId = faker.number.int();

      jest
        .spyOn(MockRoleService, 'create')
        .mockRejectedValue(new RoleAlreadyExistsException());

      await expect(controller.createRole(projectId, dto)).rejects.toThrow(
        RoleAlreadyExistsException,
      );
      expect(MockRoleService.create).toHaveBeenCalledTimes(1);
      expect(MockRoleService.create).toHaveBeenCalledWith({
        ...dto,
        projectId,
      });
    });

    it('should handle service errors properly', async () => {
      const dto = new CreateRoleDto();
      dto.name = faker.string.sample();
      dto.permissions = [getRandomEnumValue(PermissionEnum)];
      const projectId = faker.number.int();
      const error = new Error('Database error');

      jest.spyOn(MockRoleService, 'create').mockRejectedValue(error);

      await expect(controller.createRole(projectId, dto)).rejects.toThrow(
        'Database error',
      );
      expect(MockRoleService.create).toHaveBeenCalledTimes(1);
      expect(MockRoleService.create).toHaveBeenCalledWith({
        ...dto,
        projectId,
      });
    });
  });

  describe('updateRole', () => {
    it('should update a role successfully', async () => {
      const dto = new UpdateRoleDto();
      dto.name = faker.string.sample();
      dto.permissions = [getRandomEnumValue(PermissionEnum)];
      const id = faker.number.int();
      const projectId = faker.number.int();

      jest.spyOn(MockRoleService, 'update').mockResolvedValue(undefined);

      await controller.updateRole(projectId, id, dto);

      expect(MockRoleService.update).toHaveBeenCalledTimes(1);
      expect(MockRoleService.update).toHaveBeenCalledWith(id, projectId, dto);
    });

    it('should throw RoleNotFoundException when role does not exist', async () => {
      const dto = new UpdateRoleDto();
      dto.name = faker.string.sample();
      dto.permissions = [getRandomEnumValue(PermissionEnum)];
      const id = faker.number.int();
      const projectId = faker.number.int();

      jest
        .spyOn(MockRoleService, 'update')
        .mockRejectedValue(new RoleNotFoundException());

      await expect(controller.updateRole(projectId, id, dto)).rejects.toThrow(
        RoleNotFoundException,
      );
      expect(MockRoleService.update).toHaveBeenCalledTimes(1);
      expect(MockRoleService.update).toHaveBeenCalledWith(id, projectId, dto);
    });

    it('should throw RoleAlreadyExistsException when role name already exists', async () => {
      const dto = new UpdateRoleDto();
      dto.name = faker.string.sample();
      dto.permissions = [getRandomEnumValue(PermissionEnum)];
      const id = faker.number.int();
      const projectId = faker.number.int();

      jest
        .spyOn(MockRoleService, 'update')
        .mockRejectedValue(new RoleAlreadyExistsException());

      await expect(controller.updateRole(projectId, id, dto)).rejects.toThrow(
        RoleAlreadyExistsException,
      );
      expect(MockRoleService.update).toHaveBeenCalledTimes(1);
      expect(MockRoleService.update).toHaveBeenCalledWith(id, projectId, dto);
    });

    it('should handle service errors properly', async () => {
      const dto = new UpdateRoleDto();
      dto.name = faker.string.sample();
      dto.permissions = [getRandomEnumValue(PermissionEnum)];
      const id = faker.number.int();
      const projectId = faker.number.int();
      const error = new Error('Database error');

      jest.spyOn(MockRoleService, 'update').mockRejectedValue(error);

      await expect(controller.updateRole(projectId, id, dto)).rejects.toThrow(
        'Database error',
      );
      expect(MockRoleService.update).toHaveBeenCalledTimes(1);
      expect(MockRoleService.update).toHaveBeenCalledWith(id, projectId, dto);
    });
  });

  describe('deleteRole', () => {
    it('should delete a role successfully', async () => {
      const id = faker.number.int();

      jest.spyOn(MockRoleService, 'deleteById').mockResolvedValue(undefined);

      await controller.deleteRole(id);

      expect(MockRoleService.deleteById).toHaveBeenCalledTimes(1);
      expect(MockRoleService.deleteById).toHaveBeenCalledWith(id);
    });

    it('should throw RoleNotFoundException when role does not exist', async () => {
      const id = faker.number.int();

      jest
        .spyOn(MockRoleService, 'deleteById')
        .mockRejectedValue(new RoleNotFoundException());

      await expect(controller.deleteRole(id)).rejects.toThrow(
        RoleNotFoundException,
      );
      expect(MockRoleService.deleteById).toHaveBeenCalledTimes(1);
      expect(MockRoleService.deleteById).toHaveBeenCalledWith(id);
    });

    it('should handle service errors properly', async () => {
      const id = faker.number.int();
      const error = new Error('Database error');

      jest.spyOn(MockRoleService, 'deleteById').mockRejectedValue(error);

      await expect(controller.deleteRole(id)).rejects.toThrow('Database error');
      expect(MockRoleService.deleteById).toHaveBeenCalledTimes(1);
      expect(MockRoleService.deleteById).toHaveBeenCalledWith(id);
    });

    it('should handle foreign key constraint errors', async () => {
      const id = faker.number.int();
      const error = new Error('Foreign key constraint violation');

      jest.spyOn(MockRoleService, 'deleteById').mockRejectedValue(error);

      await expect(controller.deleteRole(id)).rejects.toThrow(
        'Foreign key constraint violation',
      );
      expect(MockRoleService.deleteById).toHaveBeenCalledTimes(1);
      expect(MockRoleService.deleteById).toHaveBeenCalledWith(id);
    });
  });
});
