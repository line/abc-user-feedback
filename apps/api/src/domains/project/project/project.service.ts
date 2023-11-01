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
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { Like, Not, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { OpensearchRepository } from '@/common/repositories';
import { TenantService } from '@/domains/tenant/tenant.service';
import { UserTypeEnum } from '@/domains/user/entities/enums';
import { ChannelEntity } from '../../channel/channel/channel.entity';
import { ProjectEntity } from '../../project/project/project.entity';
import { ApiKeyService } from '../api-key/api-key.service';
import { IssueTrackerService } from '../issue-tracker/issue-tracker.service';
import { MemberService } from '../member/member.service';
import { AllPermissions } from '../role/permission.enum';
import { RoleService } from '../role/role.service';
import type { FindAllProjectsDto } from './dtos';
import { CreateProjectDto, UpdateProjectDto } from './dtos';
import type { FindByProjectIdDto } from './dtos/find-by-project-id.dto';
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
    private readonly memberService: MemberService,
    private readonly apiKeyService: ApiKeyService,
    private readonly issueTrackerService: IssueTrackerService,
    private readonly configService: ConfigService,
  ) {}

  @Transactional()
  async create(dto: CreateProjectDto) {
    const project = await this.projectRepo.findOneBy({ name: dto.name });
    if (project) throw new ProjectAlreadyExistsException();

    const tenant = await this.tenantService.findOne();
    const newProject = ProjectEntity.from({ ...dto, tenantId: tenant.id });
    const savedProject = await this.projectRepo.save(newProject);

    if (dto.roles) {
      const savedRoles = await this.roleService.createMany(
        dto.roles.map((role) => ({ ...role, projectId: savedProject.id })),
      );
      savedProject.roles = savedRoles;

      if (dto.members) {
        const members = dto.members.map((member) => ({
          userId: member.userId,
          roleId: savedRoles.find((role) => {
            if (role.name === member.roleName) return true;
            else throw new BadRequestException('Invalid role name');
          }).id,
        }));
        const savedMembers = await this.memberService.createMany(members);
        savedProject.roles.forEach((role) => {
          role.members = savedMembers.filter(
            (member) => member.role.id === role.id,
          );
        });
      }
    } else {
      const savedRoles = await this.roleService.createMany([
        {
          name: 'Admin',
          permissions: AllPermissions,
          projectId: savedProject.id,
        },
        {
          name: 'Editor',
          permissions: AllPermissions.filter(
            (v) =>
              !v.includes('role') &&
              (v.includes('read') ||
                v.includes('feedback') ||
                v.includes('issue') ||
                v.includes('member_create')),
          ),
          projectId: savedProject.id,
        },
        {
          name: 'Viewer',
          permissions: AllPermissions.filter(
            (v) => v.includes('read') && !v.includes('download'),
          ),
          projectId: savedProject.id,
        },
      ]);
      savedProject.roles = savedRoles;
    }

    if (dto.apiKeys) {
      const savedApiKeys = await this.apiKeyService.createMany(
        dto.apiKeys.map((apiKey) => ({
          value: apiKey.value,
          projectId: savedProject.id,
        })),
      );
      savedProject.apiKeys = savedApiKeys;
    }

    if (dto.issueTracker) {
      const savedIssueTracker = await this.issueTrackerService.create({
        projectId: savedProject.id,
        data: dto.issueTracker,
      });
      savedProject.issueTracker = savedIssueTracker;
    }

    return savedProject;
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

    const project = await this.findById({ projectId });
    if (
      await this.projectRepo.findOne({
        where: { name, id: Not(projectId) },
        select: ['id'],
      })
    ) {
      throw new ProjectInvalidNameException('Duplicated name');
    }

    await this.projectRepo.save(Object.assign(project, { name, description }));
  }

  @Transactional()
  async deleteById(projectId: number) {
    if (this.configService.get('opensearch.use')) {
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
