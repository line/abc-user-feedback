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
import { ApiKeyService } from '@/domains/admin/project/api-key/api-key.service';
import { CreateApiKeyRequestDto } from '@/domains/admin/project/api-key/dtos/requests';
import type { FindApiKeysResponseDto } from '@/domains/admin/project/api-key/dtos/responses';
import type { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { ProjectService } from '@/domains/admin/project/project/project.service';
import { SetupTenantRequestDto } from '@/domains/admin/tenant/dtos/requests';
import { TenantService } from '@/domains/admin/tenant/tenant.service';
import { clearAllEntities, signInTestUser } from '@/test-utils/util-functions';

describe('ApiKeyController (integration)', () => {
  let app: INestApplication;

  let dataSource: DataSource;
  let authService: AuthService;
  let tenantService: TenantService;
  let projectService: ProjectService;
  let _apiKeyService: ApiKeyService;
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
    _apiKeyService = module.get(ApiKeyService);
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

  describe('/admin/projects/:projectId/api-keys (POST)', () => {
    it('should create an API key', async () => {
      const dto = new CreateApiKeyRequestDto();
      dto.value = 'TestApiKey1234567890';

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/api-keys`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(201)
        .then(
          ({
            body,
          }: {
            body: {
              id: number;
              value: string;
              createdAt: Date;
            };
          }) => {
            expect(body).toHaveProperty('id');
            expect(body).toHaveProperty('value');
            expect(body).toHaveProperty('createdAt');
            expect(body.value).toBe('TestApiKey1234567890');
          },
        );
    });

    it('should create an API key with auto-generated value when not provided', async () => {
      const dto = new CreateApiKeyRequestDto();

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/api-keys`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(201)
        .then(
          ({
            body,
          }: {
            body: {
              id: number;
              value: string;
              createdAt: Date;
            };
          }) => {
            expect(body).toHaveProperty('id');
            expect(body).toHaveProperty('value');
            expect(body).toHaveProperty('createdAt');
            expect(body.value).toMatch(/^[A-F0-9]{20}$/);
          },
        );
    });

    it('should return 400 for invalid API key length', async () => {
      const dto = new CreateApiKeyRequestDto();
      dto.value = 'ShortKey';

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/api-keys`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(400);
    });

    it('should return 401 when unauthorized', async () => {
      const dto = new CreateApiKeyRequestDto();
      dto.value = 'TestApiKey1234567890';

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/api-keys`)
        .send(dto)
        .expect(401);
    });
  });

  describe('/admin/projects/:projectId/api-keys (GET)', () => {
    beforeEach(async () => {
      const dto = new CreateApiKeyRequestDto();
      dto.value = 'TestApiKeyForList123';

      await request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/api-keys`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto);
    });

    it('should find API keys by project id', async () => {
      return request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/api-keys`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then(({ body }: { body: FindApiKeysResponseDto }) => {
          const responseBody = body;
          expect(responseBody.items.length).toBeGreaterThan(0);
          expect(responseBody.items[0]).toHaveProperty('id');
          expect(responseBody.items[0]).toHaveProperty('value');
          expect(responseBody.items[0]).toHaveProperty('createdAt');
          expect(responseBody.items[0]).toHaveProperty('deletedAt');
        });
    });

    it('should return 401 when unauthorized', async () => {
      return request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/api-keys`)
        .expect(401);
    });
  });

  describe('/admin/projects/:projectId/api-keys/:apiKeyId (DELETE)', () => {
    let apiKeyId: number;

    beforeEach(async () => {
      const dto = new CreateApiKeyRequestDto();
      dto.value = 'TestApiKeyForDelete1';

      const response = await request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/api-keys`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto);

      apiKeyId = (response.body as { id: number }).id;
    });

    it('should delete API key', async () => {
      await request(app.getHttpServer() as Server)
        .delete(`/admin/projects/${project.id}/api-keys/${apiKeyId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 401 when unauthorized', async () => {
      return request(app.getHttpServer() as Server)
        .delete(`/admin/projects/${project.id}/api-keys/${apiKeyId}`)
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
