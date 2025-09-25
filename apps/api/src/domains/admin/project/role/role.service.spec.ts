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
      jest.spyOn(roleRepo, 'save').mockResolvedValue({
        ...dto,
        id: faker.number.int(),
        project: { id: dto.projectId },
        members: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      } as unknown as RoleEntity);

      const role = await roleService.create(dto);

      expect(role.name).toEqual(dto.name);
      expect(role.permissions).toEqual(dto.permissions);
      expect(role.project.id).toEqual(dto.projectId);
      expect(roleRepo.save).toHaveBeenCalledTimes(1);
    });

    it('creating a role fails with duplicate inputs', async () => {
      const dto = new CreateRoleDto();
      dto.name = faker.string.sample();
      dto.permissions = getRandomEnumValues(PermissionEnum);
      dto.projectId = faker.number.int();
      jest
        .spyOn(roleRepo, 'findOneBy')
        .mockResolvedValue({ id: faker.number.int() } as RoleEntity);
      jest.spyOn(roleRepo, 'save');

      await expect(roleService.create(dto)).rejects.toThrow(
        RoleAlreadyExistsException,
      );

      expect(roleRepo.findOneBy).toHaveBeenCalledTimes(1);
      expect(roleRepo.findOneBy).toHaveBeenCalledWith({
        name: dto.name,
        project: { id: dto.projectId },
      });
      expect(roleRepo.save).not.toHaveBeenCalled();
    });

    it('creating a role validates role name uniqueness within project', async () => {
      const projectId = faker.number.int();
      const roleName = faker.string.sample();

      const dto1 = new CreateRoleDto();
      dto1.name = roleName;
      dto1.permissions = getRandomEnumValues(PermissionEnum);
      dto1.projectId = projectId;

      const dto2 = new CreateRoleDto();
      dto2.name = roleName;
      dto2.permissions = getRandomEnumValues(PermissionEnum);
      dto2.projectId = projectId;

      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(roleRepo, 'save').mockResolvedValueOnce({
        ...dto1,
        id: faker.number.int(),
        members: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      } as unknown as RoleEntity);

      await roleService.create(dto1);

      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValueOnce({
        id: faker.number.int(),
      } as unknown as RoleEntity);

      await expect(roleService.create(dto2)).rejects.toThrow(
        RoleAlreadyExistsException,
      );
    });

    it('creating a role allows same name in different projects', async () => {
      const roleName = faker.string.sample();

      const dto1 = new CreateRoleDto();
      dto1.name = roleName;
      dto1.permissions = getRandomEnumValues(PermissionEnum);
      dto1.projectId = faker.number.int();

      const dto2 = new CreateRoleDto();
      dto2.name = roleName;
      dto2.permissions = getRandomEnumValues(PermissionEnum);
      dto2.projectId = faker.number.int();

      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(roleRepo, 'save').mockResolvedValue({
        id: faker.number.int(),
      } as unknown as RoleEntity);

      await roleService.create(dto1);
      await roleService.create(dto2);

      expect(roleRepo.save).toHaveBeenCalledTimes(2);
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
      jest
        .spyOn(roleRepo, 'save')
        .mockImplementation(() =>
          Promise.resolve(roles[0] as unknown as RoleEntity),
        );

      const result = await roleService.createMany(dtos);

      expect(result).toHaveLength(roleCount);
      expect(roleRepo.findOneBy).toHaveBeenCalledTimes(roleCount);
      expect(roleRepo.save).toHaveBeenCalledTimes(1);
    });

    it('creating roles fails with duplicate inputs', async () => {
      jest
        .spyOn(roleRepo, 'findOneBy')
        .mockResolvedValue({ id: faker.number.int() } as RoleEntity);

      await expect(roleService.createMany(dtos)).rejects.toThrow(
        RoleAlreadyExistsException,
      );

      expect(roleRepo.findOneBy).toHaveBeenCalledTimes(1);
    });

    it('creating roles handles duplicate permissions correctly', async () => {
      const dtoWithDuplicatePermissions = new CreateRoleDto();
      dtoWithDuplicatePermissions.name = faker.string.sample();
      dtoWithDuplicatePermissions.permissions = [
        PermissionEnum.feedback_download_read,
        PermissionEnum.feedback_download_read,
        PermissionEnum.feedback_update,
      ];
      dtoWithDuplicatePermissions.projectId = faker.number.int();

      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(roleRepo, 'save').mockResolvedValue({
        ...dtoWithDuplicatePermissions,
        id: faker.number.int(),
        members: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      } as unknown as RoleEntity);

      const result = await roleService.createMany([
        dtoWithDuplicatePermissions,
      ]);

      expect(result).toBeDefined();
      expect(roleRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            permissions: expect.arrayContaining([
              PermissionEnum.feedback_download_read,
              PermissionEnum.feedback_update,
            ]),
          }),
        ]),
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

      const existingRole = {
        id: roleId,
        name: 'old-name',
        permissions: [],
      } as unknown as RoleEntity;
      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValue(existingRole);
      jest.spyOn(roleRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(roleRepo, 'save').mockResolvedValue({
        ...existingRole,
        ...dto,
      } as unknown as RoleEntity);

      const role = await roleService.update(roleId, projectId, dto);

      expect(role.name).toEqual(dto.name);
      expect(role.permissions).toEqual(dto.permissions);
      expect(roleRepo.findOneBy).toHaveBeenCalledWith({ id: roleId });
      expect(roleRepo.save).toHaveBeenCalledTimes(1);
    });

    it('updating a role fails with a duplicate name', async () => {
      const roleId = faker.number.int();
      const projectId = faker.number.int();
      const dto = new UpdateRoleDto();
      dto.name = faker.string.sample();
      dto.permissions = getRandomEnumValues(PermissionEnum);

      const existingRole = {
        id: roleId,
        name: 'old-name',
        permissions: [],
      } as unknown as RoleEntity;
      const duplicateRole = {
        id: faker.number.int(),
        name: dto.name,
      } as unknown as RoleEntity;

      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValue(existingRole);
      jest.spyOn(roleRepo, 'findOne').mockResolvedValue(duplicateRole);

      await expect(roleService.update(roleId, projectId, dto)).rejects.toThrow(
        RoleAlreadyExistsException,
      );

      expect(roleRepo.findOne).toHaveBeenCalledWith({
        where: {
          name: dto.name,
          project: { id: projectId },
          id: expect.any(Object),
        },
      });
    });

    it('updating a role creates new role when id does not exist', async () => {
      const roleId = faker.number.int();
      const projectId = faker.number.int();
      const dto = new UpdateRoleDto();
      dto.name = faker.string.sample();
      dto.permissions = getRandomEnumValues(PermissionEnum);

      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(roleRepo, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(roleRepo, 'save')
        .mockResolvedValue({ id: roleId, ...dto } as unknown as RoleEntity);

      const role = await roleService.update(roleId, projectId, dto);

      expect(role.name).toEqual(dto.name);
      expect(role.permissions).toEqual(dto.permissions);
      expect(roleRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: dto.name,
          permissions: dto.permissions,
        }),
      );
    });

    it('updating a role removes duplicate permissions', async () => {
      const roleId = faker.number.int();
      const projectId = faker.number.int();
      const dto = new UpdateRoleDto();
      dto.name = faker.string.sample();
      dto.permissions = [
        PermissionEnum.feedback_download_read,
        PermissionEnum.feedback_download_read,
        PermissionEnum.feedback_update,
      ];

      const existingRole = {
        id: roleId,
        name: 'old-name',
        permissions: [],
      } as unknown as RoleEntity;
      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValue(existingRole);
      jest.spyOn(roleRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(roleRepo, 'save').mockResolvedValue({
        ...existingRole,
        ...dto,
      } as unknown as RoleEntity);

      await roleService.update(roleId, projectId, dto);

      expect(roleRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          permissions: [
            PermissionEnum.feedback_download_read,
            PermissionEnum.feedback_update,
          ],
        }),
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

  describe('findByUserId', () => {
    it('finding roles by user id succeeds with valid user id', async () => {
      const userId = faker.number.int();
      const mockRoles = [
        {
          id: faker.number.int(),
          name: faker.string.sample(),
          project: { id: faker.number.int() },
        },
        {
          id: faker.number.int(),
          name: faker.string.sample(),
          project: { id: faker.number.int() },
        },
      ] as RoleEntity[];

      jest.spyOn(roleRepo, 'find').mockResolvedValue(mockRoles);

      const result = await roleService.findByUserId(userId);

      expect(result).toEqual(mockRoles);
      expect(roleRepo.find).toHaveBeenCalledWith({
        where: { members: { user: { id: userId } } },
        relations: { project: true },
      });
    });

    it('finding roles by user id returns empty array when user has no roles', async () => {
      const userId = faker.number.int();
      jest.spyOn(roleRepo, 'find').mockResolvedValue([]);

      const result = await roleService.findByUserId(userId);

      expect(result).toEqual([]);
      expect(roleRepo.find).toHaveBeenCalledWith({
        where: { members: { user: { id: userId } } },
        relations: { project: true },
      });
    });
  });

  describe('findByProjectId', () => {
    it('finding roles by project id succeeds with valid project id', async () => {
      const projectId = faker.number.int();
      const mockRoles = [
        { id: faker.number.int(), name: faker.string.sample() },
        { id: faker.number.int(), name: faker.string.sample() },
      ] as RoleEntity[];
      const total = mockRoles.length;

      jest
        .spyOn(roleRepo, 'findAndCountBy')
        .mockResolvedValue([mockRoles, total]);

      const result = await roleService.findByProjectId(projectId);

      expect(result.roles).toEqual(mockRoles);
      expect(result.total).toEqual(total);
      expect(roleRepo.findAndCountBy).toHaveBeenCalledWith({
        project: { id: projectId },
      });
    });

    it('finding roles by project id returns empty result when project has no roles', async () => {
      const projectId = faker.number.int();
      jest.spyOn(roleRepo, 'findAndCountBy').mockResolvedValue([[], 0]);

      const result = await roleService.findByProjectId(projectId);

      expect(result.roles).toEqual([]);
      expect(result.total).toEqual(0);
    });
  });

  describe('findAndCount', () => {
    it('finding all roles succeeds', async () => {
      const mockRoles = [
        { id: faker.number.int(), name: faker.string.sample() },
        { id: faker.number.int(), name: faker.string.sample() },
        { id: faker.number.int(), name: faker.string.sample() },
      ] as RoleEntity[];
      const total = mockRoles.length;

      jest
        .spyOn(roleRepo, 'findAndCount')
        .mockResolvedValue([mockRoles, total]);

      const result = await roleService.findAndCount();

      expect(result.roles).toEqual(mockRoles);
      expect(result.total).toEqual(total);
      expect(roleRepo.findAndCount).toHaveBeenCalledTimes(1);
    });

    it('finding all roles returns empty result when no roles exist', async () => {
      jest.spyOn(roleRepo, 'findAndCount').mockResolvedValue([[], 0]);

      const result = await roleService.findAndCount();

      expect(result.roles).toEqual([]);
      expect(result.total).toEqual(0);
    });
  });

  describe('deleteById', () => {
    it('deleting a role succeeds with valid role id', async () => {
      const roleId = faker.number.int();
      jest.spyOn(roleRepo, 'remove').mockResolvedValue({} as RoleEntity);

      await roleService.deleteById(roleId);

      expect(roleRepo.remove).toHaveBeenCalledWith(
        expect.objectContaining({ id: roleId }),
      );
    });

    it('deleting a role handles non-existent role gracefully', async () => {
      const roleId = faker.number.int();
      jest.spyOn(roleRepo, 'remove').mockResolvedValue({} as RoleEntity);

      await expect(roleService.deleteById(roleId)).resolves.not.toThrow();

      expect(roleRepo.remove).toHaveBeenCalledWith(
        expect.objectContaining({ id: roleId }),
      );
    });
  });

  describe('validateRoleName (private method)', () => {
    it('validateRoleName throws exception when role exists', async () => {
      const name = faker.string.sample();
      const projectId = faker.number.int();

      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValue({
        id: faker.number.int(),
      } as unknown as RoleEntity);

      const dto = new CreateRoleDto();
      dto.name = name;
      dto.permissions = getRandomEnumValues(PermissionEnum);
      dto.projectId = projectId;

      await expect(roleService.create(dto)).rejects.toThrow(
        RoleAlreadyExistsException,
      );

      expect(roleRepo.findOneBy).toHaveBeenCalledWith({
        name,
        project: { id: projectId },
      });
    });

    it('validateRoleName passes when role does not exist', async () => {
      const name = faker.string.sample();
      const projectId = faker.number.int();

      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(roleRepo, 'save').mockResolvedValue({
        id: faker.number.int(),
        name,
        project: { id: projectId },
      } as unknown as RoleEntity);

      const dto = new CreateRoleDto();
      dto.name = name;
      dto.permissions = getRandomEnumValues(PermissionEnum);
      dto.projectId = projectId;

      await roleService.create(dto);

      expect(roleRepo.findOneBy).toHaveBeenCalledWith({
        name,
        project: { id: projectId },
      });
      expect(roleRepo.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('integration scenarios', () => {
    it('handles complex role management workflow', async () => {
      const projectId = faker.number.int();
      const _userId = faker.number.int();

      const roles = [
        {
          name: 'admin',
          permissions: [
            PermissionEnum.feedback_download_read,
            PermissionEnum.feedback_update,
          ],
        },
        { name: 'user', permissions: [PermissionEnum.feedback_download_read] },
        { name: 'guest', permissions: [] },
      ];

      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(roleRepo, 'save').mockResolvedValue({
        id: faker.number.int(),
        project: { id: projectId },
        members: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      } as unknown as RoleEntity);

      for (const roleData of roles) {
        const dto = new CreateRoleDto();
        dto.name = roleData.name;
        dto.permissions = roleData.permissions;
        dto.projectId = projectId;

        await roleService.create(dto);
      }

      const mockRoles = roles.map((r) => ({
        ...r,
        id: faker.number.int(),
      })) as RoleEntity[];
      jest
        .spyOn(roleRepo, 'findAndCountBy')
        .mockResolvedValue([mockRoles, mockRoles.length]);

      const projectRoles = await roleService.findByProjectId(projectId);
      expect(projectRoles.roles).toHaveLength(3);
      expect(projectRoles.total).toBe(3);

      const updateDto = new UpdateRoleDto();
      updateDto.name = 'updated-admin';
      updateDto.permissions = [
        PermissionEnum.feedback_download_read,
        PermissionEnum.feedback_update,
        PermissionEnum.feedback_delete,
      ];

      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValue(mockRoles[0]);
      jest.spyOn(roleRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(roleRepo, 'save').mockResolvedValue({
        ...mockRoles[0],
        ...updateDto,
      } as unknown as RoleEntity);

      const updatedRole = await roleService.update(
        mockRoles[0].id,
        projectId,
        updateDto,
      );
      expect(updatedRole.name).toBe('updated-admin');
      expect(updatedRole.permissions).toEqual([
        PermissionEnum.feedback_download_read,
        PermissionEnum.feedback_update,
        PermissionEnum.feedback_delete,
      ]);

      jest.spyOn(roleRepo, 'remove').mockResolvedValue({} as RoleEntity);
      await roleService.deleteById(mockRoles[0].id);
      expect(roleRepo.remove).toHaveBeenCalledWith(
        expect.objectContaining({ id: mockRoles[0].id }),
      );
    });

    it('handles edge cases with empty permissions', async () => {
      const dto = new CreateRoleDto();
      dto.name = faker.string.sample();
      dto.permissions = [];
      dto.projectId = faker.number.int();

      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(roleRepo, 'save').mockResolvedValue({
        ...dto,
        id: faker.number.int(),
        members: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      } as unknown as RoleEntity);

      const role = await roleService.create(dto);
      expect(role.permissions).toEqual([]);
    });

    it('handles edge cases with null/undefined values gracefully', async () => {
      const roleId = faker.number.int();
      const projectId = faker.number.int();

      const dto = new UpdateRoleDto();
      dto.name = null as any;
      dto.permissions = null as any;

      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(roleRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(roleRepo, 'save').mockResolvedValue({
        id: roleId,
        name: null,
        permissions: null,
        members: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      } as unknown as RoleEntity);

      const result = await roleService.update(roleId, projectId, dto);
      expect(result.name).toBeNull();
      expect(result.permissions).toBeNull();
    });
  });
});
