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
import {
  CreateMemberRequestDto,
  UpdateMemberRequestDto,
} from '@/domains/admin/project/member/dtos/requests';
import type { GetAllMemberResponseDto } from '@/domains/admin/project/member/dtos/responses';
import type { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { ProjectService } from '@/domains/admin/project/project/project.service';
import { PermissionEnum } from '@/domains/admin/project/role/permission.enum';
import type { RoleEntity } from '@/domains/admin/project/role/role.entity';
import { RoleService } from '@/domains/admin/project/role/role.service';
import { SetupTenantRequestDto } from '@/domains/admin/tenant/dtos/requests';
import { TenantService } from '@/domains/admin/tenant/tenant.service';
import {
  UserStateEnum,
  UserTypeEnum,
} from '@/domains/admin/user/entities/enums';
import { UserEntity } from '@/domains/admin/user/entities/user.entity';
import { clearAllEntities, signInTestUser } from '@/test-utils/util-functions';

describe('MemberController (integration)', () => {
  let app: INestApplication;

  let dataSource: DataSource;
  let authService: AuthService;
  let tenantService: TenantService;
  let projectService: ProjectService;
  let roleService: RoleService;

  let configService: ConfigService;
  let opensearchRepository: OpensearchRepository;

  let project: ProjectEntity;
  let role: RoleEntity;
  let user: UserEntity;
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
    roleService = module.get(RoleService);
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

    role = await roleService.create({
      projectId: project.id,
      name: 'TestRole',
      permissions: [
        PermissionEnum.feedback_download_read,
        PermissionEnum.feedback_update,
      ],
    });

    const { jwt } = await signInTestUser(dataSource, authService);
    accessToken = jwt.accessToken;

    const userRepo = dataSource.getRepository(UserEntity);
    user = await userRepo.save({
      email: faker.internet.email(),
      state: UserStateEnum.Active,
      hashPassword: faker.internet.password(),
      type: UserTypeEnum.GENERAL,
    });
  });

  describe('/admin/projects/:projectId/members (POST)', () => {
    afterEach(async () => {
      await dataSource.query('DELETE FROM members WHERE role_id = ?', [
        role.id,
      ]);
    });

    it('should create a member', async () => {
      const dto = new CreateMemberRequestDto();
      dto.userId = user.id;
      dto.roleId = role.id;

      await request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/members`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(201);
    });

    it('should return 400 for duplicate member', async () => {
      const dto = new CreateMemberRequestDto();
      dto.userId = user.id;
      dto.roleId = role.id;

      await request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/members`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(201);

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/members`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(400);
    });

    it('should return 400 for non-existent user', async () => {
      const dto = new CreateMemberRequestDto();
      dto.userId = 999;
      dto.roleId = role.id;

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/members`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(400);
    });

    it('should return 404 for non-existent role', async () => {
      const dto = new CreateMemberRequestDto();
      dto.userId = user.id;
      dto.roleId = 999;

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/members`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(404);
    });

    it('should return 401 when unauthorized', async () => {
      const dto = new CreateMemberRequestDto();
      dto.userId = user.id;
      dto.roleId = role.id;

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/members`)
        .send(dto)
        .expect(401);
    });
  });

  describe('/admin/projects/:projectId/members/search (POST)', () => {
    afterEach(async () => {
      await dataSource.query('DELETE FROM members WHERE role_id = ?', [
        role.id,
      ]);
    });

    it('should find members by project id', async () => {
      await request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/members`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          userId: user.id,
          roleId: role.id,
        })
        .expect(201);

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/members/search`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          queries: [
            {
              key: 'email',
              value: user.email,
              condition: 'LIKE',
            },
          ],
          operator: 'AND',
          limit: 10,
          page: 1,
        })
        .expect(201)
        .then(({ body }: { body: GetAllMemberResponseDto }) => {
          const responseBody = body;
          expect(responseBody.items.length).toBeGreaterThan(0);
          expect(responseBody.items[0]).toHaveProperty('id');
          expect(responseBody.items[0]).toHaveProperty('user');
          expect(responseBody.items[0]).toHaveProperty('role');
          expect(responseBody.items[0].user).toHaveProperty('email');
          expect(responseBody.items[0].role).toHaveProperty('name');
        });
    });

    it('should return empty list when no members match search', async () => {
      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/members/search`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          queries: [
            {
              key: 'email',
              value: 'NonExistentUser',
              condition: 'LIKE',
            },
          ],
          operator: 'AND',
          limit: 10,
          page: 1,
        })
        .expect(201)
        .then(({ body }: { body: GetAllMemberResponseDto }) => {
          const responseBody = body;
          expect(responseBody.items.length).toBe(0);
        });
    });

    it('should return 401 when unauthorized', async () => {
      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/members/search`)
        .send({
          queries: [],
          operator: 'AND',
          limit: 10,
          page: 1,
        })
        .expect(401);
    });
  });

  describe('/admin/projects/:projectId/members/:memberId (GET)', () => {
    afterEach(async () => {
      await dataSource.query('DELETE FROM members WHERE role_id = ?', [
        role.id,
      ]);
    });

    it('should return 404 for non-existent member', async () => {
      return request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/members/999`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/admin/projects/:projectId/members/:memberId (PUT)', () => {
    let memberId: number;
    let newRole: RoleEntity;

    beforeEach(async () => {
      newRole = await roleService.create({
        projectId: project.id,
        name: `NewTestRole_${Date.now()}`,
        permissions: [PermissionEnum.feedback_download_read],
      });

      const dto = new CreateMemberRequestDto();
      dto.userId = user.id;
      dto.roleId = role.id;

      await request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/members`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(201);

      const allMembers: { id: number }[] = await dataSource.query(
        'SELECT id FROM members ORDER BY id DESC LIMIT 1',
      );
      memberId = allMembers.length > 0 ? allMembers[0].id : 1;
    });

    afterEach(async () => {
      await dataSource.query(
        'DELETE FROM members WHERE role_id = ? OR role_id = ?',
        [role.id, newRole.id],
      );
      await dataSource.query('DELETE FROM roles WHERE id = ?', [newRole.id]);
    });

    it('should update member role', async () => {
      const dto = new UpdateMemberRequestDto();
      dto.roleId = newRole.id;

      const response = await request(app.getHttpServer() as Server)
        .put(`/admin/projects/${project.id}/members/${memberId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto);

      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent role', async () => {
      const dto = new UpdateMemberRequestDto();
      dto.roleId = 999;

      return request(app.getHttpServer() as Server)
        .put(`/admin/projects/${project.id}/members/${memberId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(404);
    });

    it('should return 400 for non-existent member', async () => {
      const dto = new UpdateMemberRequestDto();
      dto.roleId = newRole.id;

      return request(app.getHttpServer() as Server)
        .put(`/admin/projects/${project.id}/members/999`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(400);
    });

    it('should return 401 when unauthorized', async () => {
      const dto = new UpdateMemberRequestDto();
      dto.roleId = newRole.id;

      return request(app.getHttpServer() as Server)
        .put(`/admin/projects/${project.id}/members/${memberId}`)
        .send(dto)
        .expect(401);
    });
  });

  describe('/admin/projects/:projectId/members/:memberId (DELETE)', () => {
    let memberId: number;

    beforeEach(async () => {
      const dto = new CreateMemberRequestDto();
      dto.userId = user.id;
      dto.roleId = role.id;

      await request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/members`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(201);

      const allMembers: { id: number }[] = await dataSource.query(
        'SELECT id FROM members ORDER BY id DESC LIMIT 1',
      );
      memberId = allMembers.length > 0 ? allMembers[0].id : 1;
    });

    afterEach(async () => {
      await dataSource.query('DELETE FROM members WHERE role_id = ?', [
        role.id,
      ]);
    });

    it('should delete member', async () => {
      const response = await request(app.getHttpServer() as Server)
        .delete(`/admin/projects/${project.id}/members/${memberId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
    });

    it('should return 200 when deleting non-existent member', async () => {
      return request(app.getHttpServer() as Server)
        .delete(`/admin/projects/${project.id}/members/999`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 401 when unauthorized', async () => {
      return request(app.getHttpServer() as Server)
        .delete(`/admin/projects/${project.id}/members/${memberId}`)
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
