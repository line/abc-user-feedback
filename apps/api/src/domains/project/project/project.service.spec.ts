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
import { Like } from 'typeorm';

import { TenantEntity } from '@/domains/tenant/tenant.entity';
import { UserDto } from '@/domains/user/dtos';
import { UserTypeEnum } from '@/domains/user/entities/enums';
import {
  createQueryBuilder,
  MockOpensearchRepository,
} from '@/utils/test-utils';
import { ChannelEntity } from '../../channel/channel/channel.entity';
import { ProjectEntity } from '../../project/project/project.entity';
import { CreateProjectDto, FindAllProjectsDto, UpdateProjectDto } from './dtos';
import { FindByProjectIdDto } from './dtos/find-by-project-id.dto';
import {
  ProjectAlreadyExistsException,
  ProjectInvalidNameException,
  ProjectNotFoundException,
} from './exceptions';
import { ProjectService } from './project.service';
import { ProjectServiceProviders } from './project.service.providers';

describe('ProjectService Test suite', () => {
  let projectService: ProjectService;
  let projectRepo: Repository<ProjectEntity>;
  let tenantRepo: Repository<TenantEntity>;
  let channelRepo: Repository<ChannelEntity>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: ProjectServiceProviders,
    }).compile();

    projectService = module.get<ProjectService>(ProjectService);
    projectRepo = module.get(getRepositoryToken(ProjectEntity));
    tenantRepo = module.get(getRepositoryToken(TenantEntity));
    channelRepo = module.get(getRepositoryToken(ChannelEntity));
  });

  describe('create', () => {
    const name = faker.string.sample();
    const description = faker.string.sample();
    let dto: CreateProjectDto;
    beforeEach(() => {
      dto = new CreateProjectDto();
      dto.name = name;
      dto.description = description;
    });

    it('creating a project succeeds with valid inputs', async () => {
      const projectId = faker.number.int();
      jest.spyOn(projectRepo, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(tenantRepo, 'find').mockResolvedValue([{}] as TenantEntity[]);
      jest
        .spyOn(projectRepo, 'save')
        .mockResolvedValue({ id: projectId } as any);

      const { id } = await projectService.create(dto);

      expect(projectRepo.findOneBy).toBeCalledTimes(1);
      expect(tenantRepo.find).toBeCalledTimes(1);
      expect(projectRepo.save).toBeCalledTimes(1);
      expect(id).toEqual(projectId);
    });
    it('creating a project fails with an existent project name', async () => {
      const projectId = faker.number.int();
      jest
        .spyOn(projectRepo, 'findOneBy')
        .mockResolvedValue({ name: dto.name } as ProjectEntity);
      jest.spyOn(tenantRepo, 'find').mockResolvedValue([{}] as TenantEntity[]);
      jest
        .spyOn(projectRepo, 'save')
        .mockResolvedValue({ id: projectId } as any);

      await expect(projectService.create(dto)).rejects.toThrowError(
        ProjectAlreadyExistsException,
      );

      expect(projectRepo.findOneBy).toBeCalledTimes(1);
      expect(tenantRepo.findOne).not.toBeCalled();
      expect(projectRepo.save).not.toBeCalled();
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
      dto.searchText = faker.string.sample();
      jest
        .spyOn(projectRepo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);
      jest.spyOn(createQueryBuilder, 'setFindOptions');

      await projectService.findAll(dto);

      expect(createQueryBuilder.setFindOptions).toBeCalledTimes(1);
      expect(createQueryBuilder.setFindOptions).toBeCalledWith({
        where: { name: Like(`%${dto.searchText}%`) },
        order: { createdAt: 'DESC' },
      });
    });
    it('finding all projects succeds as a GENERAL user', async () => {
      const userId = faker.number.int();
      dto.user = new UserDto();
      dto.user.type = UserTypeEnum.GENERAL;
      dto.user.id = userId;
      dto.searchText = faker.string.sample();
      jest
        .spyOn(projectRepo, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);
      jest.spyOn(createQueryBuilder, 'setFindOptions');

      await projectService.findAll(dto);

      expect(createQueryBuilder.setFindOptions).toBeCalledTimes(1);
      expect(createQueryBuilder.setFindOptions).toBeCalledWith({
        where: {
          name: Like(`%${dto.searchText}%`),
          roles: { members: { user: { id: userId } } },
        },
        order: { createdAt: 'DESC' },
      });
    });
  });
  describe('findById', () => {
    let dto: FindByProjectIdDto;
    beforeEach(() => {
      dto = new FindByProjectIdDto();
    });
    it('finding a project by an id succeeds with a valid id', async () => {
      const projectId = faker.number.int();
      jest.spyOn(projectRepo, 'findOneBy').mockResolvedValue({
        id: projectId,
      } as ProjectEntity);

      const project = await projectService.findById(dto);

      expect(projectRepo.findOneBy).toBeCalledTimes(1);
      expect(projectRepo.findOneBy).toBeCalledWith({ id: dto.projectId });
      expect(project.id).toEqual(projectId);
    });
    it('finding a project by an id fails with an invalid id', async () => {
      jest.spyOn(projectRepo, 'findOneBy').mockResolvedValue(null);

      await expect(projectService.findById(dto)).rejects.toThrowError(
        ProjectNotFoundException,
      );

      expect(projectRepo.findOneBy).toBeCalledTimes(1);
      expect(projectRepo.findOneBy).toBeCalledWith({ id: dto.projectId });
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
      const projectId = faker.number.int();
      const name = faker.string.sample();
      dto.name = name;
      jest.spyOn(projectRepo, 'findOneBy').mockResolvedValue({
        id: projectId,
      } as ProjectEntity);
      jest
        .spyOn(projectRepo, 'findOne')
        .mockResolvedValue(null as ProjectEntity);
      jest
        .spyOn(projectRepo, 'save')
        .mockResolvedValue({ id: projectId } as any);

      await projectService.update(dto);

      expect(projectRepo.findOneBy).toBeCalledTimes(1);
      expect(projectRepo.findOne).toBeCalledTimes(1);
      expect(projectRepo.save).toBeCalledTimes(1);
    });
    it('updating a project fails with a duplicate name', async () => {
      const projectId = faker.number.int();
      const name = 'DUPLICATE_NAME';
      dto.name = name;
      jest.spyOn(projectRepo, 'findOneBy').mockResolvedValue({
        id: projectId,
      } as ProjectEntity);
      jest
        .spyOn(projectRepo, 'findOne')
        .mockResolvedValue({ name } as ProjectEntity);
      jest
        .spyOn(projectRepo, 'save')
        .mockResolvedValue({ id: projectId } as any);

      await expect(projectService.update(dto)).rejects.toThrowError(
        new ProjectInvalidNameException('Duplicated name'),
      );

      expect(projectRepo.findOneBy).toBeCalledTimes(1);
      expect(projectRepo.findOne).toBeCalledTimes(1);
      expect(projectRepo.save).not.toBeCalled();
    });
  });
  describe('deleteById', () => {
    it('deleting a project succeeds with a valid id', async () => {
      const projectId = faker.number.int();
      const channelCount = faker.number.int({ min: 1, max: 10 });
      jest.spyOn(channelRepo, 'find').mockResolvedValue(
        Array(channelCount).fill({
          id: faker.number.int(),
        }) as ChannelEntity[],
      );
      jest.spyOn(projectRepo, 'remove');

      await projectService.deleteById(projectId);

      expect(channelRepo.find).toBeCalledTimes(1);
      expect(MockOpensearchRepository.deleteIndex).toBeCalledTimes(
        channelCount,
      );
      expect(projectRepo.remove).toBeCalledTimes(1);
    });
  });
});
