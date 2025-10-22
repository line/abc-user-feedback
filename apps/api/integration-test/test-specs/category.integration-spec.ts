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
import { CategoryService } from '@/domains/admin/project/category/category.service';
import {
  CreateCategoryRequestDto,
  UpdateCategoryRequestDto,
} from '@/domains/admin/project/category/dtos/requests';
import type { GetAllCategoriesResponseDto } from '@/domains/admin/project/category/dtos/responses';
import type { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { ProjectService } from '@/domains/admin/project/project/project.service';
import { SetupTenantRequestDto } from '@/domains/admin/tenant/dtos/requests';
import { TenantService } from '@/domains/admin/tenant/tenant.service';
import { clearAllEntities, signInTestUser } from '@/test-utils/util-functions';

describe('CategoryController (integration)', () => {
  let app: INestApplication;

  let dataSource: DataSource;
  let authService: AuthService;
  let tenantService: TenantService;
  let projectService: ProjectService;
  let _categoryService: CategoryService;
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
    _categoryService = module.get(CategoryService);
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

  describe('/admin/projects/:projectId/categories (POST)', () => {
    it('should create a category', async () => {
      const dto = new CreateCategoryRequestDto();
      dto.name = 'TestCategory';

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/categories`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(201)
        .then(({ body }: { body: { id: number } }) => {
          expect(body).toHaveProperty('id');
          expect(typeof body.id).toBe('number');
        });
    });

    it('should return 401 when unauthorized', async () => {
      const dto = new CreateCategoryRequestDto();
      dto.name = 'TestCategory';

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/categories`)
        .send(dto)
        .expect(401);
    });
  });

  describe('/admin/projects/:projectId/categories/search (POST)', () => {
    beforeEach(async () => {
      const dto = new CreateCategoryRequestDto();
      dto.name = 'TestCategoryForList';

      await request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/categories`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto);
    });

    it('should find categories by project id', async () => {
      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/categories/search`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          categoryName: 'TestCategory',
          page: 1,
          limit: 10,
        })
        .expect(201)
        .then(({ body }: { body: GetAllCategoriesResponseDto }) => {
          const responseBody = body;
          expect(responseBody.items.length).toBeGreaterThan(0);
          expect(responseBody.items[0]).toHaveProperty('id');
          expect(responseBody.items[0]).toHaveProperty('name');
        });
    });

    it('should return empty list when no categories match search', async () => {
      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/categories/search`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          categoryName: 'NonExistentCategory',
          page: 1,
          limit: 10,
        })
        .expect(201)
        .then(({ body }: { body: GetAllCategoriesResponseDto }) => {
          const responseBody = body;
          expect(responseBody.items.length).toBe(0);
        });
    });

    it('should return 401 when unauthorized', async () => {
      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/categories/search`)
        .send({
          page: 1,
          limit: 10,
        })
        .expect(401);
    });
  });

  describe('/admin/projects/:projectId/categories/:categoryId (PUT)', () => {
    let categoryId: number;

    beforeEach(async () => {
      const dto = new CreateCategoryRequestDto();
      dto.name = 'TestCategoryForUpdate';

      const response = await request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/categories`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto);

      categoryId = (response.body as { id: number }).id;
    });

    it('should update category', async () => {
      const dto = new UpdateCategoryRequestDto();
      dto.name = 'UpdatedTestCategory';

      await request(app.getHttpServer() as Server)
        .put(`/admin/projects/${project.id}/categories/${categoryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(200);

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/categories/search`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          categoryName: 'UpdatedTestCategory',
          page: 1,
          limit: 10,
        })
        .expect(201)
        .then(({ body }: { body: GetAllCategoriesResponseDto }) => {
          expect(body.items.length).toBeGreaterThan(0);
          expect(body.items[0].name).toBe('UpdatedTestCategory');
        });
    });

    it('should return 404 for non-existent category', async () => {
      const dto = new UpdateCategoryRequestDto();
      dto.name = 'UpdatedCategory';

      return request(app.getHttpServer() as Server)
        .put(`/admin/projects/${project.id}/categories/999`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(404);
    });

    it('should return 401 when unauthorized', async () => {
      const dto = new UpdateCategoryRequestDto();
      dto.name = 'UpdatedCategory';

      return request(app.getHttpServer() as Server)
        .put(`/admin/projects/${project.id}/categories/${categoryId}`)
        .send(dto)
        .expect(401);
    });
  });

  describe('/admin/projects/:projectId/categories/:categoryId (DELETE)', () => {
    let categoryId: number;

    beforeEach(async () => {
      const dto = new CreateCategoryRequestDto();
      dto.name = 'TestCategoryForDelete';

      const response = await request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/categories`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto);

      categoryId = (response.body as { id: number }).id;
    });

    it('should delete category', async () => {
      await request(app.getHttpServer() as Server)
        .delete(`/admin/projects/${project.id}/categories/${categoryId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/categories/search`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          categoryName: 'TestCategoryForDelete',
          page: 1,
          limit: 10,
        })
        .expect(201)
        .then(({ body }: { body: GetAllCategoriesResponseDto }) => {
          expect(body.items.length).toBe(0);
        });
    });

    it('should return 404 when deleting non-existent category', async () => {
      return request(app.getHttpServer() as Server)
        .delete(`/admin/projects/${project.id}/categories/999`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 401 when unauthorized', async () => {
      return request(app.getHttpServer() as Server)
        .delete(`/admin/projects/${project.id}/categories/${categoryId}`)
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
