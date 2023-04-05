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
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { TestConfigs, clearEntities } from '@/utils/test-utils';

import { ChannelEntity } from '../entities/channel.entity';
import { ProjectEntity } from '../entities/project.entity';
import { CreateProjectDto, FindAllProjectsDto, UpdateProjectDto } from './dtos';
import { FindByProjectIdDto } from './dtos/projects/find-by-project-id.dto';
import { ProjectService } from './project.service';

describe('Project Test suite', () => {
  let projectService: ProjectService;

  let dataSource: DataSource;

  let projectRepo: Repository<ProjectEntity>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ...TestConfigs,
        TypeOrmModule.forFeature([ProjectEntity, ChannelEntity]),
      ],
      providers: [ProjectService],
    }).compile();

    projectService = module.get<ProjectService>(ProjectService);

    dataSource = module.get(DataSource);
    projectRepo = dataSource.getRepository(ProjectEntity);
  });
  afterEach(async () => {
    await dataSource.destroy();
  });

  it('should be defined', () => {
    expect(projectService).toBeDefined();
  });
  beforeEach(async () => {
    await clearEntities([projectRepo]);
  });
  describe('create project', () => {
    it('positive case', async () => {
      const dto = new CreateProjectDto();
      dto.name = faker.datatype.string();
      dto.description = faker.datatype.string();

      const { id } = await projectService.create(dto);

      const project = await projectRepo.findOneBy({ name: dto.name });

      expect(project.id).toEqual(id);
      expect(project.name).toEqual(dto.name);
      expect(project.description).toEqual(dto.description);
    });
  });
  describe('find project ', () => {
    let total: number;
    beforeEach(async () => {
      total = faker.datatype.number({ min: 10, max: 20 });
      await projectRepo.save(
        Array.from({ length: total }).map(() => ({
          name: faker.datatype.string(),
          description: faker.datatype.string(),
        })),
      );
    });
    it('positive case', async () => {
      const dto = new FindAllProjectsDto();
      dto.options = { limit: 10, page: 1 };

      const { items, meta } = await projectService.findAll(dto);
      expect(items).toHaveLength(+dto.options.limit);
      expect(meta.totalItems).toEqual(total);
    });
    it('with keyword', async () => {
      const dto = new FindAllProjectsDto();
      dto.options = { limit: 10, page: 1 };
      dto.keyword = faker.datatype.string(1);

      const result = await projectService.findAll(dto);

      expect(
        result.items.every((v) => v.name.match(new RegExp(dto.keyword, 'i'))),
      ).toEqual(true);
    });
  });
  describe('find by project id ', () => {
    let total: number;
    let projects: ProjectEntity[];
    beforeEach(async () => {
      total = faker.datatype.number({ min: 10, max: 20 });
      projects = await projectRepo.save(
        Array.from({ length: total }).map(() => ({
          name: faker.datatype.string(),
          description: faker.datatype.string(),
        })),
      );
    });
    it('positive case', async () => {
      const index = faker.datatype.number(total - 1);
      const dto = new FindByProjectIdDto();
      dto.projectId = projects[index].id;

      const result = await projectService.findById(dto);
      expect(result).toMatchObject(projects[index]);
    });
  });
  describe('update ', () => {
    let total: number;
    let projects: ProjectEntity[];
    beforeEach(async () => {
      total = faker.datatype.number({ min: 10, max: 20 });
      projects = await projectRepo.save(
        Array.from({ length: total }).map(() => ({
          name: faker.datatype.string(),
          description: faker.datatype.string(),
        })),
      );
    });
    it('positive case', async () => {
      const index = faker.datatype.number(total - 1);

      const dto = new UpdateProjectDto();
      dto.projectId = projects[index].id;
      dto.name = faker.datatype.string();
      dto.description = faker.datatype.string();

      await projectService.update(dto);

      const project = await projectRepo.findOneBy({ id: dto.projectId });
      expect(project.name).toEqual(dto.name);
      expect(project.description).toEqual(dto.description);
    });
  });
});
