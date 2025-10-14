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
import type { Server } from 'net';
import { faker } from '@faker-js/faker';
import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import request from 'supertest';
import type { DataSource } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from '@/app.module';
import { OpensearchRepository } from '@/common/repositories';
import { AuthService } from '@/domains/admin/auth/auth.service';
import type { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { ProjectService } from '@/domains/admin/project/project/project.service';
import {
  CreateRoleRequestDto,
  UpdateRoleRequestDto,
} from '@/domains/admin/project/role/dtos/requests';
import type { GetAllRolesResponseDto } from '@/domains/admin/project/role/dtos/responses';
import type { GetAllRolesResponseRoleDto } from '@/domains/admin/project/role/dtos/responses/get-all-roles-response.dto';
import { PermissionEnum } from '@/domains/admin/project/role/permission.enum';
import { RoleService } from '@/domains/admin/project/role/role.service';
import { SetupTenantRequestDto } from '@/domains/admin/tenant/dtos/requests';
import { TenantService } from '@/domains/admin/tenant/tenant.service';
import { clearAllEntities, signInTestUser } from '@/test-utils/util-functions';

describe('RoleController (integration)', () => {
  let app: INestApplication;

  let dataSource: DataSource;
  let authService: AuthService;
  let tenantService: TenantService;
  let projectService: ProjectService;
  let _roleService: RoleService;
  let configService: ConfigService;
  let opensearchRepository: OpensearchRepository;

  let project: ProjectEntity;
  let accessToken: string;

  beforeAll(async () => {
    initializeTransactionalContext();
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    dataSource = module.get(getDataSourceToken());
    authService = module.get(AuthService);
    tenantService = module.get(TenantService);
    projectService = module.get(ProjectService);
    _roleService = module.get(RoleService);
    configService = module.get(ConfigService);
    opensearchRepository = module.get(OpensearchRepository);

    await clearAllEntities(module);
    if (configService.get('opensearch.use')) {
      await opensearchRepository.deleteAllIndexes();
    }

    const dto = new SetupTenantRequestDto();
    dto.siteName = faker.string.sample();
    dto.password = '12345678';
    await tenantService.create(dto);

    project = await projectService.create({
      name: faker.lorem.words(),
      description: faker.lorem.lines(1),
      timezone: {
        countryCode: 'KR',
        name: 'Asia/Seoul',
        offset: '+09:00',
      },
    });

    const { jwt } = await signInTestUser(dataSource, authService);
    accessToken = jwt.accessToken;
  });

  describe('/admin/projects/:projectId/roles (POST)', () => {
    it('should create a role', async () => {
      const dto = new CreateRoleRequestDto();
      dto.name = 'TestRole';
      dto.permissions = [
        PermissionEnum.feedback_download_read,
        PermissionEnum.feedback_update,
      ];

      await request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/roles`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(201);

      const listResponse = await request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/roles`)
        .set('Authorization', `Bearer ${accessToken}`)
        .query({
          searchText: 'TestRole',
          page: 1,
          limit: 10,
        })
        .expect(200);

      const roles = (listResponse.body as GetAllRolesResponseDto).roles;
      expect(roles.length).toBeGreaterThan(0);

      const createdRole = roles.find(
        (role: GetAllRolesResponseRoleDto) => role.name === 'TestRole',
      );
      expect(createdRole).toBeDefined();
      expect(createdRole?.name).toBe('TestRole');
      expect(createdRole?.permissions).toEqual([
        'feedback_download_read',
        'feedback_update',
      ]);
    });

    it('should return 400 for empty role name', async () => {
      const dto = new CreateRoleRequestDto();
      dto.permissions = [PermissionEnum.feedback_download_read];

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/roles`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(400);
    });

    it('should return 400 for invalid permissions', async () => {
      const dto = new CreateRoleRequestDto();
      dto.name = 'TestRole';
      dto.permissions = [];

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/roles`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(400);
    });

    it('should return 401 when unauthorized', async () => {
      const dto = new CreateRoleRequestDto();
      dto.name = 'TestRole';
      dto.permissions = [PermissionEnum.feedback_download_read];

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/roles`)
        .send(dto)
        .expect(401);
    });
  });

  describe('/admin/projects/:projectId/roles (GET)', () => {
    beforeEach(async () => {
      // 테스트용 역할 생성
      const dto = new CreateRoleRequestDto();
      dto.name = 'TestRoleForList';
      dto.permissions = [PermissionEnum.feedback_download_read];

      await request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/roles`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto);
    });

    it('should find roles by project id', async () => {
      return request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/roles`)
        .set('Authorization', `Bearer ${accessToken}`)
        .query({
          searchText: 'TestRole',
          page: 1,
          limit: 10,
        })
        .expect(200)
        .then(({ body }: { body: GetAllRolesResponseDto }) => {
          const responseBody = body;
          expect(responseBody.roles.length).toBeGreaterThan(0);
          expect(responseBody.roles[0]).toHaveProperty('id');
          expect(responseBody.roles[0]).toHaveProperty('name');
          expect(responseBody.roles[0]).toHaveProperty('permissions');
        });
    });

    it('should return 401 when unauthorized', async () => {
      return request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/roles`)
        .query({
          page: 1,
          limit: 10,
        })
        .expect(401);
    });
  });

  describe('/admin/projects/:projectId/roles/:roleId (PUT)', () => {
    let roleId: number;

    beforeAll(async () => {
      const dto = new CreateRoleRequestDto();
      dto.name = 'TestRoleForUpdate';
      dto.permissions = [PermissionEnum.feedback_download_read];

      await request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/roles`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(201);

      const response = await request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/roles`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const roles = (response.body as GetAllRolesResponseDto).roles;
      const createdRole = roles.find(
        (role: GetAllRolesResponseRoleDto) => role.name === 'TestRoleForUpdate',
      );
      if (!createdRole) {
        throw new Error('TestRoleForUpdate not found');
      }
      roleId = createdRole.id;
    });

    it('should update role', async () => {
      const dto = new UpdateRoleRequestDto();
      dto.name = 'UpdatedTestRole';
      dto.permissions = [PermissionEnum.feedback_download_read];

      await request(app.getHttpServer() as Server)
        .put(`/admin/projects/${project.id}/roles/${roleId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(204);

      await request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/roles`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then(({ body }: { body: GetAllRolesResponseDto }) => {
          const roles = body.roles;
          const updatedRole = roles.find(
            (role: GetAllRolesResponseRoleDto) =>
              role.name === 'UpdatedTestRole',
          );
          if (!updatedRole) {
            throw new Error('UpdatedTestRole not found');
          }
          expect(updatedRole.name).toBe('UpdatedTestRole');
          expect(updatedRole.permissions).toEqual(['feedback_download_read']);
        });
    });

    it('should return 400 for empty role name', async () => {
      const dto = new UpdateRoleRequestDto();
      dto.permissions = [PermissionEnum.feedback_download_read];

      return request(app.getHttpServer() as Server)
        .put(`/admin/projects/${project.id}/roles/${roleId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(400);
    });

    it('should return 401 when unauthorized', async () => {
      const dto = new UpdateRoleRequestDto();
      dto.name = 'UpdatedRole';
      dto.permissions = [PermissionEnum.feedback_download_read];

      return request(app.getHttpServer() as Server)
        .put(`/admin/projects/${project.id}/roles/${roleId}`)
        .send(dto)
        .expect(401);
    });
  });

  describe('/admin/projects/:projectId/roles/:roleId (DELETE)', () => {
    let roleId: number;

    beforeAll(async () => {
      const dto = new CreateRoleRequestDto();
      dto.name = 'TestRoleForDelete';
      dto.permissions = [PermissionEnum.feedback_download_read];

      await request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/roles`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(201);

      const response = await request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/roles`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const roles = (response.body as GetAllRolesResponseDto).roles;
      const createdRole = roles.find(
        (role: GetAllRolesResponseRoleDto) => role.name === 'TestRoleForDelete',
      );
      if (!createdRole) {
        throw new Error('TestRoleForDelete not found');
      }
      roleId = createdRole.id;
    });

    it('should delete role', async () => {
      await request(app.getHttpServer() as Server)
        .delete(`/admin/projects/${project.id}/roles/${roleId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // 삭제된 Role이 목록에 없는지 확인
      const response = await request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/roles`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const roles = (response.body as GetAllRolesResponseDto).roles;
      const deletedRole = roles.find(
        (role: GetAllRolesResponseRoleDto) => role.name === 'TestRoleForDelete',
      );
      expect(deletedRole).toBeUndefined();
    });

    it('should return 401 when unauthorized', async () => {
      return request(app.getHttpServer() as Server)
        .delete(`/admin/projects/${project.id}/roles/${roleId}`)
        .expect(401);
    });
  });

  afterAll(async () => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    await delay(500);
    await app.close();
  });
});
