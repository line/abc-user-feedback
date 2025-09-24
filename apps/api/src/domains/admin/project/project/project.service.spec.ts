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

import {
  projectFixture,
  roleFixture,
  userFixture,
} from '@/test-utils/fixtures';
import { getRandomEnumValues, TestConfig } from '@/test-utils/util-functions';
import { ProjectServiceProviders } from '../../../../test-utils/providers/project.service.providers';
import { UserDto } from '../../user/dtos';
import { UserTypeEnum } from '../../user/entities/enums';
import { ApiKeyEntity } from '../api-key/api-key.entity';
import { MemberEntity } from '../member/member.entity';
import { PermissionEnum } from '../role/permission.enum';
import { RoleEntity } from '../role/role.entity';
import { CreateProjectDto, FindAllProjectsDto, UpdateProjectDto } from './dtos';
import { FindByProjectIdDto } from './dtos/find-by-project-id.dto';
import {
  ProjectAlreadyExistsException,
  ProjectInvalidNameException,
  ProjectNotFoundException,
} from './exceptions';
import { ProjectEntity } from './project.entity';
import { ProjectService } from './project.service';

describe('ProjectService Test suite', () => {
  let projectService: ProjectService;
  let projectRepo: Repository<ProjectEntity>;
  let roleRepo: Repository<RoleEntity>;
  let memberRepo: Repository<MemberEntity>;
  let apiKeyRepo: Repository<ApiKeyEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TestConfig],
      providers: ProjectServiceProviders,
    }).compile();

    projectService = module.get<ProjectService>(ProjectService);
    projectRepo = module.get(getRepositoryToken(ProjectEntity));
    roleRepo = module.get(getRepositoryToken(RoleEntity));
    memberRepo = module.get(getRepositoryToken(MemberEntity));
    apiKeyRepo = module.get(getRepositoryToken(ApiKeyEntity));
  });

  describe('create', () => {
    const name = faker.string.sample();
    const description = faker.string.sample();
    const projectId = projectFixture.id;
    let dto: CreateProjectDto;
    beforeEach(() => {
      dto = new CreateProjectDto();
      dto.name = name;
      dto.description = description;
    });

    it('creating a project succeeds with project data', async () => {
      jest.spyOn(projectRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValue(null);

      const project = await projectService.create(dto);

      expect(project.id).toEqual(projectId);
      expect(project.name).toEqual(name);
      expect(project.description).toEqual(description);
    });
    it('creating a project succeeds with project data and role data', async () => {
      dto.roles = [
        {
          name: faker.string.sample(),
          permissions: getRandomEnumValues(PermissionEnum),
        },
      ];
      jest.spyOn(projectRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValue(null);

      const project = await projectService.create(dto);

      expect(project.id).toEqual(projectId);
      expect(project.name).toEqual(name);
      expect(project.description).toEqual(description);
      expect(project.roles).toMatchObject(dto.roles);
    });
    it('creating a project succeeds with project data and role data and member data', async () => {
      dto.roles = [
        {
          name: roleFixture.name,
          permissions: getRandomEnumValues(PermissionEnum),
        },
      ];
      dto.members = [
        {
          roleName: roleFixture.name,
          userId: userFixture.id,
        },
      ];
      jest.spyOn(projectRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(memberRepo, 'findOne').mockResolvedValue(null);

      const project = await projectService.create(dto);

      expect(project.id).toEqual(projectId);
      expect(project.name).toEqual(name);
      expect(project.description).toEqual(description);
      expect(project.roles).toMatchObject(dto.roles);
      expect(project.roles[0].members[0].role.name).toEqual(
        dto.members[0].roleName,
      );
      expect(project.roles[0].members[0].user.id).toEqual(
        dto.members[0].userId,
      );
    });
    it('creating a project succeeds with project data and role data and member data and api key data', async () => {
      dto.roles = [
        {
          name: roleFixture.name,
          permissions: getRandomEnumValues(PermissionEnum),
        },
      ];
      dto.members = [
        {
          roleName: roleFixture.name,
          userId: userFixture.id,
        },
      ];
      dto.apiKeys = [
        {
          value: faker.string.alphanumeric(20),
        },
      ];
      jest.spyOn(projectRepo, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(memberRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(apiKeyRepo, 'findOneBy').mockResolvedValue(null);

      const project = await projectService.create(dto);

      expect(project.id).toEqual(projectId);
      expect(project.name).toEqual(name);
      expect(project.description).toEqual(description);
      expect(project.roles).toMatchObject(dto.roles);
      expect(project.roles[0].members[0].role.name).toEqual(
        dto.members[0].roleName,
      );
      expect(project.roles[0].members[0].user.id).toEqual(
        dto.members[0].userId,
      );
      expect(project.apiKeys).toMatchObject(dto.apiKeys);
    });
    it('creating a project succeeds with project data and role data and member data and api key data and issue tracker data', async () => {
      dto.roles = [
        {
          name: roleFixture.name,
          permissions: getRandomEnumValues(PermissionEnum),
        },
      ];
      dto.members = [
        {
          roleName: roleFixture.name,
          userId: userFixture.id,
        },
      ];
      dto.apiKeys = [
        {
          value: faker.string.alphanumeric(20),
        },
      ];
      dto.issueTracker = {
        data: {
          ticketKey: faker.string.sample(),
          ticketDomain: faker.internet.url(),
        },
      };
      jest.spyOn(projectRepo, 'findOneBy').mockResolvedValueOnce(null);
      jest.spyOn(roleRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(memberRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(apiKeyRepo, 'findOneBy').mockResolvedValue(null);

      const project = await projectService.create(dto);

      expect(project.id).toEqual(projectId);
      expect(project.name).toEqual(name);
      expect(project.description).toEqual(description);
      expect(project.roles).toMatchObject(dto.roles);
      expect(project.roles[0].members[0].role.name).toEqual(
        dto.members[0].roleName,
      );
      expect(project.roles[0].members[0].user.id).toEqual(
        dto.members[0].userId,
      );
      expect(project.apiKeys).toMatchObject(dto.apiKeys);
      expect(project.issueTracker).toMatchObject(dto.issueTracker);
    });

    it('creating a project fails with an existent project name', async () => {
      await expect(projectService.create(dto)).rejects.toThrow(
        ProjectAlreadyExistsException,
      );
    });
  });
  describe('findAll', () => {
    let dto: FindAllProjectsDto;
    beforeEach(() => {
      dto = new FindAllProjectsDto();
      dto.options = { limit: 10, page: 1 };
    });
    it('finding all projects succeds as a SUPER user', async () => {
      dto.user = new UserDto();
      dto.user.type = UserTypeEnum.SUPER;

      const { meta } = await projectService.findAll(dto);

      expect(meta.totalItems).toEqual(1);
    });
    it('finding all projects succeds as a GENERAL user', async () => {
      const userId = faker.number.int();
      dto.user = new UserDto();
      dto.user.type = UserTypeEnum.GENERAL;
      dto.user.id = userId;
      dto.searchText = faker.string.sample();

      const { meta } = await projectService.findAll(dto);

      expect(meta.totalItems).toEqual(1);
    });
  });
  describe('findById', () => {
    let dto: FindByProjectIdDto;
    beforeEach(() => {
      dto = new FindByProjectIdDto();
    });
    it('finding a project by an id succeeds with a valid id', async () => {
      const projectId = projectFixture.id;

      const project = await projectService.findById(dto);

      expect(project.id).toEqual(projectId);
    });
    it('finding a project by an id fails with an invalid id', async () => {
      jest.spyOn(projectRepo, 'findOneBy').mockResolvedValue(null);

      await expect(projectService.findById(dto)).rejects.toThrow(
        ProjectNotFoundException,
      );
    });
  });
  describe('update ', () => {
    const description = faker.string.sample();
    let dto: UpdateProjectDto;
    beforeEach(() => {
      dto = new UpdateProjectDto();
      dto.description = description;
    });
    it('updating a project succeeds with valid inputs', async () => {
      const name = faker.string.sample();
      dto.name = name;
      jest.spyOn(projectRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(projectRepo, 'save');

      await projectService.update(dto);

      expect(projectRepo.save).toHaveBeenCalledTimes(1);
    });
    it('updating a project fails with a duplicate name', async () => {
      const name = 'DUPLICATE_NAME';
      dto.name = name;
      jest.spyOn(projectRepo, 'save');

      await expect(projectService.update(dto)).rejects.toThrow(
        new ProjectInvalidNameException('Duplicated name'),
      );

      expect(projectRepo.save).not.toHaveBeenCalled();
    });
  });
  describe('deleteById', () => {
    it('deleting a project succeeds with a valid id', async () => {
      const projectId = faker.number.int();
      jest.spyOn(projectRepo, 'remove');

      await projectService.deleteById(projectId);

      expect(projectRepo.remove).toHaveBeenCalledTimes(1);
    });
  });
});
