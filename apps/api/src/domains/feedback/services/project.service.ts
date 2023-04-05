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
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { Like, Not, Repository } from 'typeorm';

import { ProjectEntity } from '../entities/project.entity';
import {
  ProjectAlreadyExistsException,
  ProjectInvalidNameException,
  ProjectNotFoundException,
} from '../exceptions/projects';
import { CreateProjectDto, FindAllProjectsDto, UpdateProjectDto } from './dtos';
import { FindByProjectIdDto } from './dtos/projects/find-by-project-id.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepo: Repository<ProjectEntity>,
  ) {}

  async create(dto: CreateProjectDto) {
    const project = await this.projectRepo.findOneBy({ name: dto.name });
    if (project) throw new ProjectAlreadyExistsException();

    return await this.projectRepo.save(dto);
  }

  async findAll({ options, keyword = '' }: FindAllProjectsDto) {
    return await paginate(this.projectRepo, options, {
      where: { name: Like(`%${keyword}%`) },
      order: { createdAt: 'DESC' },
    });
  }

  async findById({ projectId }: FindByProjectIdDto) {
    const project = await this.projectRepo.findOneBy({ id: projectId });
    if (!project) throw new ProjectNotFoundException();
    return project;
  }

  async update(dto: UpdateProjectDto) {
    const { projectId, name, description } = dto;

    await this.findById({ projectId });
    if (
      await this.projectRepo.findOne({
        where: { name, id: Not(projectId) },
        select: ['id'],
      })
    ) {
      throw new ProjectInvalidNameException('Duplicated name');
    }

    await this.projectRepo.update(projectId, { name, description });
  }
}
