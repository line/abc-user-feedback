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
import { Transactional } from 'typeorm-transactional';

import { OpensearchRepository } from '@/common/repositories';
import { OS_USE } from '@/configs/opensearch.config';
import { TenantService } from '@/domains/tenant/tenant.service';
import { UserTypeEnum } from '@/domains/user/entities/enums';

import { ChannelEntity } from '../../channel/channel/channel.entity';
import { ProjectEntity } from '../../project/project/project.entity';
import { AllPermissionList } from '../role/permission.enum';
import { RoleService } from '../role/role.service';
import { CreateProjectDto, FindAllProjectsDto, UpdateProjectDto } from './dtos';
import { FindByProjectIdDto } from './dtos/find-by-project-id.dto';
import {
  ProjectAlreadyExistsException,
  ProjectInvalidNameException,
  ProjectNotFoundException,
} from './exceptions';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepo: Repository<ProjectEntity>,
    @InjectRepository(ChannelEntity)
    private readonly channelRepo: Repository<ChannelEntity>,
    private readonly osRepository: OpensearchRepository,
    private readonly tenantService: TenantService,
    private readonly roleService: RoleService,
  ) {}

  @Transactional()
  async create(dto: CreateProjectDto) {
    const project = await this.projectRepo.findOneBy({ name: dto.name });
    if (project) throw new ProjectAlreadyExistsException();

    const tenant = await this.tenantService.findOne();

    const newProject = await this.projectRepo.save({ ...dto, tenant });
    await this.roleService.create({
      name: 'Admin',
      permissions: AllPermissionList,
      projectId: newProject.id,
    });
    await this.roleService.create({
      name: 'Editor',
      permissions: AllPermissionList.filter(
        (v) =>
          !v.includes('role') &&
          (v.includes('read') ||
            v.includes('feedback') ||
            v.includes('issue') ||
            v.includes('member_create')),
      ),
      projectId: newProject.id,
    });
    await this.roleService.create({
      name: 'Viewer',
      permissions: AllPermissionList.filter(
        (v) => v.includes('read') && !v.includes('download'),
      ),
      projectId: newProject.id,
    });

    return newProject;
  }

  async findAll({ options, user, searchText = '' }: FindAllProjectsDto) {
    if (user.type === UserTypeEnum.SUPER) {
      return await paginate(
        this.projectRepo.createQueryBuilder().setFindOptions({
          where: { name: Like(`%${searchText}%`) },
          order: { createdAt: 'DESC' },
        }),
        options,
      );
    }

    return await paginate(
      this.projectRepo.createQueryBuilder().setFindOptions({
        where: {
          name: Like(`%${searchText}%`),
          roles: { members: { user: { id: user.id } } },
        },
        order: { createdAt: 'DESC' },
      }),
      options,
    );
  }

  async findById({ projectId }: FindByProjectIdDto) {
    const project = await this.projectRepo.findOneBy({ id: projectId });
    if (!project) throw new ProjectNotFoundException();
    return project;
  }

  @Transactional()
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

    await this.projectRepo.update(projectId, {
      id: projectId,
      name,
      description,
    });
  }

  @Transactional()
  async deleteById(projectId: number) {
    if (OS_USE) {
      const channels = await this.channelRepo.find({
        where: { project: { id: projectId } },
      });

      for (const channel of channels) {
        await this.osRepository.deleteIndex(channel.id.toString());
      }
    }

    const project = new ProjectEntity();
    project.id = projectId;
    await this.projectRepo.remove(project);
  }
}
