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
import {
  EventStatusEnum,
  EventTypeEnum,
  WebhookStatusEnum,
} from '@/common/enums';
import { OpensearchRepository } from '@/common/repositories';
import { AuthService } from '@/domains/admin/auth/auth.service';
import type { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { ProjectService } from '@/domains/admin/project/project/project.service';
import {
  CreateWebhookRequestDto,
  UpdateWebhookRequestDto,
} from '@/domains/admin/project/webhook/dtos/requests';
import type {
  GetWebhookByIdResponseDto,
  GetWebhooksByProjectIdResponseDto,
} from '@/domains/admin/project/webhook/dtos/responses';
import { SetupTenantRequestDto } from '@/domains/admin/tenant/dtos/requests';
import { TenantService } from '@/domains/admin/tenant/tenant.service';
import { clearAllEntities, signInTestUser } from '@/test-utils/util-functions';

describe('WebhookController (integration)', () => {
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

  describe('/admin/projects/:projectId/webhooks (POST)', () => {
    it('should create a webhook', async () => {
      const dto = new CreateWebhookRequestDto();
      dto.name = 'TestWebhook';
      dto.url = 'https://example.com/webhook';
      dto.events = [
        {
          type: EventTypeEnum.FEEDBACK_CREATION,
          status: EventStatusEnum.ACTIVE,
          channelIds: [],
        },
      ];
      dto.status = WebhookStatusEnum.ACTIVE;

      await request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/webhooks`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(201);

      return request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/webhooks`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(200)
        .then(({ body }: { body: GetWebhooksByProjectIdResponseDto }) => {
          expect(body.items[0].name).toBe('TestWebhook');
          expect(body.items[0].url).toBe('https://example.com/webhook');
          expect(body.items[0].events).toHaveLength(1);
          expect(body.items[0].status).toBe(WebhookStatusEnum.ACTIVE);
          expect(body.items[0].createdAt).toBeDefined();
        });
    });

    it('should return 400 for empty webhook name', async () => {
      const dto = new CreateWebhookRequestDto();
      dto.url = 'https://example.com/webhook';
      dto.events = [
        {
          type: EventTypeEnum.FEEDBACK_CREATION,
          status: EventStatusEnum.ACTIVE,
          channelIds: [],
        },
      ];
      dto.status = WebhookStatusEnum.ACTIVE;

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/webhooks`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(400);
    });

    it('should return 400 for invalid URL format', async () => {
      const dto = new CreateWebhookRequestDto();
      dto.name = 'TestWebhook';
      dto.url = 'invalid-url';
      dto.events = [
        {
          type: EventTypeEnum.FEEDBACK_CREATION,
          status: EventStatusEnum.ACTIVE,
          channelIds: [],
        },
      ];
      dto.status = WebhookStatusEnum.ACTIVE;

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/webhooks`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(400);
    });

    it('should return 400 for empty events array', async () => {
      const dto = new CreateWebhookRequestDto();
      dto.name = 'TestWebhook';
      dto.url = 'https://example.com/webhook';
      dto.events = [];
      dto.status = WebhookStatusEnum.ACTIVE;

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/webhooks`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(400);
    });

    it('should return 401 when unauthorized', async () => {
      const dto = new CreateWebhookRequestDto();
      dto.name = 'TestWebhook';
      dto.url = 'https://example.com/webhook';
      dto.events = [
        {
          type: EventTypeEnum.FEEDBACK_CREATION,
          status: EventStatusEnum.ACTIVE,
          channelIds: [],
        },
      ];
      dto.status = WebhookStatusEnum.ACTIVE;

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/webhooks`)
        .send(dto)
        .expect(401);
    });
  });

  describe('/admin/projects/:projectId/webhooks (GET)', () => {
    beforeEach(async () => {
      const dto = new CreateWebhookRequestDto();
      dto.name = 'TestWebhookForList';
      dto.url = 'https://example.com/webhook';
      dto.events = [
        {
          type: EventTypeEnum.FEEDBACK_CREATION,
          status: EventStatusEnum.ACTIVE,
          channelIds: [],
        },
      ];
      dto.status = WebhookStatusEnum.ACTIVE;

      await request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/webhooks`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto);
    });

    it('should find webhooks by project id', async () => {
      return request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/webhooks`)
        .set('Authorization', `Bearer ${accessToken}`)
        .query({
          searchText: 'TestWebhook',
          page: 1,
          limit: 10,
        })
        .expect(200)
        .then(({ body }: { body: GetWebhooksByProjectIdResponseDto }) => {
          const responseBody = body;
          expect(responseBody.items.length).toBeGreaterThan(0);
          expect(responseBody.items[0]).toHaveProperty('id');
          expect(responseBody.items[0]).toHaveProperty('name');
          expect(responseBody.items[0]).toHaveProperty('url');
          expect(responseBody.items[0]).toHaveProperty('events');
          expect(responseBody.items[0]).toHaveProperty('status');
          expect(responseBody.items[0]).toHaveProperty('createdAt');
        });
    });

    it('should return 401 when unauthorized', async () => {
      return request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/webhooks`)
        .query({
          page: 1,
          limit: 10,
        })
        .expect(401);
    });
  });

  describe('/admin/projects/:projectId/webhooks/:webhookId (GET)', () => {
    let webhookId: number;

    beforeEach(async () => {
      const dto = new CreateWebhookRequestDto();
      dto.name = 'TestWebhookForGet';
      dto.url = 'https://example.com/webhook';
      dto.events = [
        {
          type: EventTypeEnum.FEEDBACK_CREATION,
          status: EventStatusEnum.ACTIVE,
          channelIds: [],
        },
      ];
      dto.status = WebhookStatusEnum.ACTIVE;

      const response = await request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/webhooks`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto);

      webhookId = (response.body as { id: number }).id;
    });

    it('should find webhook by id', async () => {
      const response = await request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/webhooks/${webhookId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const body = response.body as GetWebhookByIdResponseDto[];
      expect(response.body).toBeDefined();
      expect(body[0].id).toBe(webhookId);
      expect(body[0].name).toBe('TestWebhookForGet');
      expect(body[0].url).toBe('https://example.com/webhook');
      expect(body[0].events).toHaveLength(1);
      expect(body[0].status).toBe(WebhookStatusEnum.ACTIVE);
      expect(body[0].createdAt).toBeDefined();
    });

    it('should return 200 for non-existent webhook', async () => {
      return request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/webhooks/999`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 401 when unauthorized', async () => {
      return request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/webhooks/${webhookId}`)
        .expect(401);
    });
  });

  describe('/admin/projects/:projectId/webhooks/:webhookId (PUT)', () => {
    let webhookId: number;

    beforeEach(async () => {
      const dto = new CreateWebhookRequestDto();
      dto.name = 'TestWebhookForUpdate';
      dto.url = 'https://example.com/webhook';
      dto.events = [
        {
          type: EventTypeEnum.FEEDBACK_CREATION,
          status: EventStatusEnum.ACTIVE,
          channelIds: [],
        },
      ];
      dto.status = WebhookStatusEnum.ACTIVE;

      const response = await request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/webhooks`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto);

      webhookId = (response.body as { id: number }).id;
    });

    it('should update webhook', async () => {
      const dto = new UpdateWebhookRequestDto();
      dto.name = 'UpdatedTestWebhook';
      dto.url = 'https://updated-example.com/webhook';
      dto.events = [
        {
          type: EventTypeEnum.FEEDBACK_CREATION,
          status: EventStatusEnum.ACTIVE,
          channelIds: [],
        },
      ];
      dto.status = WebhookStatusEnum.ACTIVE;
      dto.token = null;

      await request(app.getHttpServer() as Server)
        .put(`/admin/projects/${project.id}/webhooks/${webhookId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(200);

      const response = await request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/webhooks/${webhookId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toBeDefined();
      const body = response.body as GetWebhookByIdResponseDto[];
      expect(body[0].name).toBe('UpdatedTestWebhook');
      expect(body[0].url).toBe('https://updated-example.com/webhook');
      expect(body[0].events).toHaveLength(1);
      expect(body[0].events[0].type).toBe(EventTypeEnum.FEEDBACK_CREATION);
      expect(body[0].status).toBe(WebhookStatusEnum.ACTIVE);
    });

    it('should update webhook with empty name', async () => {
      const dto = new UpdateWebhookRequestDto();
      dto.name = '';
      dto.url = 'https://updated-example.com/webhook';
      dto.events = [
        {
          type: EventTypeEnum.FEEDBACK_CREATION,
          status: EventStatusEnum.ACTIVE,
          channelIds: [],
        },
      ];
      dto.status = WebhookStatusEnum.ACTIVE;
      dto.token = null;

      return request(app.getHttpServer() as Server)
        .put(`/admin/projects/${project.id}/webhooks/${webhookId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(200);
    });

    it('should update webhook with invalid URL', async () => {
      const dto = new UpdateWebhookRequestDto();
      dto.name = 'UpdatedWebhook';
      dto.url = 'invalid-url';
      dto.events = [
        {
          type: EventTypeEnum.FEEDBACK_CREATION,
          status: EventStatusEnum.ACTIVE,
          channelIds: [],
        },
      ];
      dto.status = WebhookStatusEnum.ACTIVE;
      dto.token = null;

      return request(app.getHttpServer() as Server)
        .put(`/admin/projects/${project.id}/webhooks/${webhookId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(200);
    });

    it('should return 400 for non-existent webhook', async () => {
      const dto = new UpdateWebhookRequestDto();
      dto.name = 'UpdatedWebhook';
      dto.url = 'https://updated-example.com/webhook';
      dto.events = [
        {
          type: EventTypeEnum.FEEDBACK_CREATION,
          status: EventStatusEnum.ACTIVE,
          channelIds: [],
        },
      ];
      dto.status = WebhookStatusEnum.ACTIVE;
      dto.token = null;

      return request(app.getHttpServer() as Server)
        .put(`/admin/projects/${project.id}/webhooks/999`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(400);
    });

    it('should return 401 when unauthorized', async () => {
      const dto = new UpdateWebhookRequestDto();
      dto.name = 'UpdatedWebhook';
      dto.url = 'https://updated-example.com/webhook';
      dto.events = [
        {
          type: EventTypeEnum.FEEDBACK_CREATION,
          status: EventStatusEnum.ACTIVE,
          channelIds: [],
        },
      ];
      dto.status = WebhookStatusEnum.ACTIVE;

      return request(app.getHttpServer() as Server)
        .put(`/admin/projects/${project.id}/webhooks/${webhookId}`)
        .send(dto)
        .expect(401);
    });
  });

  describe('/admin/projects/:projectId/webhooks/:webhookId (DELETE)', () => {
    let webhookId: number;

    beforeEach(async () => {
      const dto = new CreateWebhookRequestDto();
      dto.name = 'TestWebhookForDelete';
      dto.url = 'https://example.com/webhook';
      dto.events = [
        {
          type: EventTypeEnum.FEEDBACK_CREATION,
          status: EventStatusEnum.ACTIVE,
          channelIds: [],
        },
      ];
      dto.status = WebhookStatusEnum.ACTIVE;

      const response = await request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/webhooks`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto);

      webhookId = (response.body as { id: number }).id;
    });

    it('should delete webhook', async () => {
      await request(app.getHttpServer() as Server)
        .delete(`/admin/projects/${project.id}/webhooks/${webhookId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      return request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/webhooks/${webhookId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 500 when deleting non-existent webhook', async () => {
      return request(app.getHttpServer() as Server)
        .delete(`/admin/projects/${project.id}/webhooks/999`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(500);
    });

    it('should return 401 when unauthorized', async () => {
      return request(app.getHttpServer() as Server)
        .delete(`/admin/projects/${project.id}/webhooks/${webhookId}`)
        .expect(401);
    });
  });

  describe('/admin/projects/:projectId/webhooks/:webhookId/test (POST)', () => {
    let webhookId: number;

    beforeEach(async () => {
      const dto = new CreateWebhookRequestDto();
      dto.name = 'TestWebhookForTest';
      dto.url = 'https://example.com/webhook';
      dto.events = [
        {
          type: EventTypeEnum.FEEDBACK_CREATION,
          status: EventStatusEnum.ACTIVE,
          channelIds: [],
        },
      ];
      dto.status = WebhookStatusEnum.ACTIVE;

      const response = await request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/webhooks`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto);

      webhookId = (response.body as { id: number }).id;
    });

    it('should return 404 for test webhook', async () => {
      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/webhooks/${webhookId}/test`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 404 for non-existent webhook test', async () => {
      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/webhooks/999/test`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 404 when unauthorized for test', async () => {
      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/webhooks/${webhookId}/test`)
        .expect(404);
    });
  });

  afterAll(async () => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    await delay(500);
    await app.close();
  });
});
