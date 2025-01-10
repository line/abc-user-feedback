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
import type { Server } from 'net';
import { faker } from '@faker-js/faker';
import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import type { DataSource, Repository } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from '@/app.module';
import { OpensearchRepository } from '@/common/repositories';
import { AuthService } from '@/domains/admin/auth/auth.service';
import { ChannelService } from '@/domains/admin/channel/channel/channel.service';
import { FieldEntity } from '@/domains/admin/channel/field/field.entity';
import { FeedbackService } from '@/domains/admin/feedback/feedback.service';
import {
  CreateProjectRequestDto,
  FindProjectsRequestDto,
  UpdateProjectRequestDto,
} from '@/domains/admin/project/project/dtos/requests';
import type {
  CountFeedbacksByIdResponseDto,
  FindProjectByIdResponseDto,
  FindProjectsResponseDto,
} from '@/domains/admin/project/project/dtos/responses';
import { ProjectService } from '@/domains/admin/project/project/project.service';
import { SetupTenantRequestDto } from '@/domains/admin/tenant/dtos/requests';
import { TenantService } from '@/domains/admin/tenant/tenant.service';
import {
  clearAllEntities,
  createChannel,
  createFeedback,
  signInTestUser,
} from '@/test-utils/util-functions';

describe('ProjectController (integration)', () => {
  let app: INestApplication;

  let dataSource: DataSource;
  let authService: AuthService;

  let tenantService: TenantService;
  let projectService: ProjectService;
  let channelService: ChannelService;
  let feedbackService: FeedbackService;
  let configService: ConfigService;

  let fieldRepo: Repository<FieldEntity>;

  let opensearchRepository: OpensearchRepository;

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
    channelService = module.get(ChannelService);
    feedbackService = module.get(FeedbackService);
    configService = module.get(ConfigService);

    opensearchRepository = module.get(OpensearchRepository);

    fieldRepo = module.get(getRepositoryToken(FieldEntity));

    await clearAllEntities(module);
    if (configService.get('opensearch.use')) {
      await opensearchRepository.deleteAllIndexes();
    }

    const dto = new SetupTenantRequestDto();
    dto.siteName = faker.string.sample();
    dto.password = '12345678';
    await tenantService.create(dto);

    const { jwt } = await signInTestUser(dataSource, authService);
    accessToken = jwt.accessToken;
  });

  describe('/admin/projects (POST)', () => {
    it('should create a project', async () => {
      const dto = new CreateProjectRequestDto();
      dto.name = 'TestProject';

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(201);
    });
  });

  describe('/admin/projects (GET)', () => {
    it('should find projects', async () => {
      const dto = new FindProjectsRequestDto();
      dto.limit = 10;
      dto.page = 1;

      return request(app.getHttpServer() as Server)
        .get(`/admin/projects`)
        .set('Authorization', `Bearer ${accessToken}`)
        .query(dto)
        .expect(200)
        .then(({ body }: { body: FindProjectsResponseDto }) => {
          expect(body.items.length).toEqual(1);
          expect(body.items[0].name).toEqual('TestProject');
        });
    });
  });

  describe('/admin/projects/:projectId (GET)', () => {
    it('should find a project by id', async () => {
      const dto = new FindProjectsRequestDto();
      dto.limit = 10;
      dto.page = 1;

      return request(app.getHttpServer() as Server)
        .get(`/admin/projects/1`)
        .set('Authorization', `Bearer ${accessToken}`)
        .query(dto)
        .expect(200)
        .then(({ body }: { body: FindProjectByIdResponseDto }) => {
          expect(body.name).toEqual('TestProject');
        });
    });
  });

  describe('/admin/projects/:projectId/feedback-count (GET)', () => {
    it('should count feedbacks by project id', async () => {
      const project = await projectService.findById({ projectId: 1 });
      const channel = await createChannel(channelService, project);

      const fields = await fieldRepo.find({
        where: { channel: { id: channel.id } },
        relations: { options: true },
      });

      await createFeedback(fields, channel.id, feedbackService);

      return request(app.getHttpServer() as Server)
        .get(`/admin/projects/1/feedback-count`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then(({ body }: { body: CountFeedbacksByIdResponseDto }) => {
          expect(body.total).toEqual(1);
        });
    });
  });

  describe('/admin/projects/:projectId (PUT)', () => {
    it('should update a project', async () => {
      const dto = new UpdateProjectRequestDto();
      dto.name = 'UpdatedTestProject';

      await request(app.getHttpServer() as Server)
        .put(`/admin/projects/1`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(200);

      const findDto = new FindProjectsRequestDto();
      findDto.limit = 10;
      findDto.page = 1;

      return request(app.getHttpServer() as Server)
        .get(`/admin/projects`)
        .set('Authorization', `Bearer ${accessToken}`)
        .query(findDto)
        .expect(200)
        .then(({ body }: { body: FindProjectsResponseDto }) => {
          expect(body.items.length).toEqual(1);
          expect(body.items[0].name).toEqual('UpdatedTestProject');
        });
    });
  });

  describe('/admin/projects/:projectId (DELETE)', () => {
    it('should delete a project', async () => {
      await request(app.getHttpServer() as Server)
        .delete(`/admin/projects/1`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const findDto = new FindProjectsRequestDto();
      findDto.limit = 10;
      findDto.page = 1;

      return request(app.getHttpServer() as Server)
        .get(`/admin/projects`)
        .set('Authorization', `Bearer ${accessToken}`)
        .query(findDto)
        .expect(200)
        .then(({ body }: { body: FindProjectsResponseDto }) => {
          expect(body.items.length).toEqual(0);
        });
    });
  });

  afterAll(async () => {
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    await delay(500);
    await app.close();
  });
});
