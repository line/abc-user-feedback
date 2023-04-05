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

import { getMockProvider } from '@/utils/test-utils';

import { ProjectService } from '../services/project.service';
import {
  CreateProjectRequestDto,
  FindProjectsRequestDto,
} from './dtos/requests/projects';
import { ProjectController } from './project.controller';

describe('ProjectController', () => {
  let projectController: ProjectController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [getMockProvider(ProjectService, MockProjectService)],
    }).compile();

    projectController = module.get(ProjectController);
  });

  describe('create', () => {
    it('should return an array of users', async () => {
      jest.spyOn(MockProjectService, 'create');
      const dto = new CreateProjectRequestDto();
      dto.name = faker.datatype.string();
      dto.description = faker.datatype.string();

      await projectController.create(dto);
      expect(MockProjectService.create).toBeCalledTimes(1);
    });
  });
  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(MockProjectService, 'findAll');
      const dto = new FindProjectsRequestDto();
      dto.limit = faker.datatype.number();
      dto.page = faker.datatype.number();

      await projectController.findAll(dto);
      expect(MockProjectService.findAll).toBeCalledTimes(1);
    });
  });
});

const MockProjectService = {
  create: jest.fn(),
  findAll: jest.fn(),
};
