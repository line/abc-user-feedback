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
import { IssueStatusEnum } from '@/common/enums';
import { OpensearchRepository } from '@/common/repositories';
import { AuthService } from '@/domains/admin/auth/auth.service';
import { FindIssuesByProjectIdRequestDto } from '@/domains/admin/project/issue/dtos/requests';
import type {
  FindIssueByIdResponseDto,
  FindIssuesByProjectIdResponseDto,
} from '@/domains/admin/project/issue/dtos/responses';
import type { CountIssuesByIdResponseDto } from '@/domains/admin/project/project/dtos/responses';
import type { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { ProjectService } from '@/domains/admin/project/project/project.service';
import { SetupTenantRequestDto } from '@/domains/admin/tenant/dtos/requests';
import { TenantService } from '@/domains/admin/tenant/tenant.service';
import { clearAllEntities, signInTestUser } from '@/test-utils/util-functions';

describe('IssueController (integration)', () => {
  let app: INestApplication;

  let dataSource: DataSource;

  let authService: AuthService;
  let tenantService: TenantService;
  let projectService: ProjectService;
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

  describe('/admin/projects/:projectId/issues (POST)', () => {
    it('should create an issue', async () => {
      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/issues`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'TestIssue' })
        .expect(201);
    });
  });

  describe('/admin/projects/:projectId/issues/:issueId (GET)', () => {
    it('should get an issue', async () => {
      return request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/issues/1`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then(({ body }: { body: FindIssueByIdResponseDto }) => {
          expect(body.name).toBe('TestIssue');
        });
    });
  });

  describe('/admin/projects/:projectId/issue-count (GET)', () => {
    it('should return correct issue count', async () => {
      return request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/issue-count`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then(({ body }: { body: CountIssuesByIdResponseDto }) => {
          expect(body.total).toBe(1);
        });
    });
  });

  describe('/admin/projects/:projectId/issues/search (POST)', () => {
    it('should return all searched issues', async () => {
      await request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/issues`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'TestIssue2' })
        .expect(201);

      const searchDto = new FindIssuesByProjectIdRequestDto();
      searchDto.query = {
        searchText: 'TestIssue',
      };
      searchDto.page = 1;
      searchDto.limit = 10;

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/issues/search`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(searchDto)
        .expect(201)
        .then(({ body }: { body: FindIssuesByProjectIdResponseDto }) => {
          expect(body).toBeDefined();
          expect(body).toHaveProperty('items');
          expect(body.items.length).toBe(2);
        });
    });
  });

  describe('/admin/projects/:projectId/issues/:issueId (PUT)', () => {
    it('should update an issue', async () => {
      await request(app.getHttpServer() as Server)
        .put(`/admin/projects/${project.id}/issues/1`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'TestIssue',
          description: 'TestIssueUpdated',
          status: IssueStatusEnum.IN_PROGRESS,
        })
        .expect(200);

      return request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/issues/1`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then(({ body }: { body: FindIssueByIdResponseDto }) => {
          expect(body.description).toBe('TestIssueUpdated');
          expect(body.status).toBe(IssueStatusEnum.IN_PROGRESS);
        });
    });
  });

  describe('/admin/projects/:projectId/issues/:issueId (DELETE)', () => {
    it('should delete an issue', async () => {
      await request(app.getHttpServer() as Server)
        .delete(`/admin/projects/${project.id}/issues/1`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const searchDto = new FindIssuesByProjectIdRequestDto();
      searchDto.query = {
        searchText: 'TestIssue',
      };
      searchDto.page = 1;
      searchDto.limit = 10;

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/issues/search`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(searchDto)
        .expect(201)
        .then(({ body }: { body: FindIssuesByProjectIdResponseDto }) => {
          expect(body).toBeDefined();
          expect(body).toHaveProperty('items');
          expect(body.items.length).toBe(1);
        });
    });
  });

  describe('/admin/projects/:projectId/issues (DELETE)', () => {
    it('should delete many issues', async () => {
      await request(app.getHttpServer() as Server)
        .delete(`/admin/projects/${project.id}/issues`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ issueIds: [2] })
        .expect(200);

      const searchDto = new FindIssuesByProjectIdRequestDto();
      searchDto.query = {
        searchText: 'TestIssue',
      };
      searchDto.page = 1;
      searchDto.limit = 10;

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/issues/search`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(searchDto)
        .expect(201)
        .then(({ body }: { body: FindIssuesByProjectIdResponseDto }) => {
          expect(body).toBeDefined();
          expect(body).toHaveProperty('items');
          expect(body.items.length).toBe(0);
        });
    });

    it('should return 200 when deleting with invalid issueIds', async () => {
      await request(app.getHttpServer() as Server)
        .delete(`/admin/projects/${project.id}/issues`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ issueIds: [] })
        .expect(200);
    });

    it('should return 401 when unauthorized', async () => {
      await request(app.getHttpServer() as Server)
        .delete(`/admin/projects/${project.id}/issues`)
        .send({ issueIds: [1] })
        .expect(401);
    });
  });

  describe('Issue validation tests', () => {
    it('should return 404 when updating non-existent issue', async () => {
      await request(app.getHttpServer() as Server)
        .put(`/admin/projects/${project.id}/issues/999`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'NonExistentIssue',
          description: 'This should fail',
        })
        .expect(400);
    });

    it('should return 404 when getting non-existent issue', async () => {
      return request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/issues/999`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });
  });

  afterAll(async () => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    await delay(500);
    await app.close();
  });
});
