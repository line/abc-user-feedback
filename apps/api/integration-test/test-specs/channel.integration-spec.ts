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
  FieldFormatEnum,
  FieldPropertyEnum,
  FieldStatusEnum,
} from '@/common/enums';
import { OpensearchRepository } from '@/common/repositories';
import { AuthService } from '@/domains/admin/auth/auth.service';
import {
  CreateChannelRequestDto,
  CreateChannelRequestFieldDto,
  FindChannelsByProjectIdRequestDto,
  UpdateChannelFieldsRequestDto,
  UpdateChannelRequestDto,
  UpdateChannelRequestFieldDto,
} from '@/domains/admin/channel/channel/dtos/requests';
import type {
  FindChannelByIdResponseDto,
  FindChannelsByProjectIdResponseDto,
} from '@/domains/admin/channel/channel/dtos/responses';
import type { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { ProjectService } from '@/domains/admin/project/project/project.service';
import { SetupTenantRequestDto } from '@/domains/admin/tenant/dtos/requests';
import { TenantService } from '@/domains/admin/tenant/tenant.service';
import { clearAllEntities, signInTestUser } from '@/test-utils/util-functions';

describe('ChannelController (integration)', () => {
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

  describe('/admin/projects/:projectId/channels (POST)', () => {
    it('should create a channel', async () => {
      const dto = new CreateChannelRequestDto();
      dto.name = 'TestChannel';

      const fieldDto = new CreateChannelRequestFieldDto();
      fieldDto.name = 'TestField';
      fieldDto.key = 'testField';
      fieldDto.format = FieldFormatEnum.text;
      fieldDto.property = FieldPropertyEnum.EDITABLE;
      fieldDto.status = FieldStatusEnum.ACTIVE;

      dto.fields = [fieldDto];

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/channels`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(201);
    });
  });

  describe('/admin/projects/:projectId/channels (GET)', () => {
    it('should find channels by project id', async () => {
      const dto = new FindChannelsByProjectIdRequestDto();
      dto.searchText = 'TestChannel';
      dto.page = 1;
      dto.limit = 10;
      return request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/channels`)
        .set('Authorization', `Bearer ${accessToken}`)
        .query(dto)
        .expect(200)
        .then(({ body }: { body: FindChannelsByProjectIdResponseDto }) => {
          expect(body.items.length).toBe(1);
          expect(body.items[0].name).toBe('TestChannel');
        });
    });
  });

  describe('/admin/projects/:projectId/channels/:channelId (GET)', () => {
    it('should find channel by id', async () => {
      return request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/channels/1`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then(({ body }: { body: FindChannelByIdResponseDto }) => {
          expect(body.name).toBe('TestChannel');
        });
    });
  });

  describe('/admin/projects/:projectId/channels/:channelId (PUT)', () => {
    it('should update channel', async () => {
      const dto = new UpdateChannelRequestDto();
      dto.name = 'TestChannelUpdated';

      await request(app.getHttpServer() as Server)
        .put(`/admin/projects/${project.id}/channels/1`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(200);

      await request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/channels/1`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then(({ body }: { body: FindChannelByIdResponseDto }) => {
          expect(body.name).toBe('TestChannelUpdated');
        });
    });
  });

  describe('/admin/projects/:projectId/channels/:channelId/fields (PUT)', () => {
    it('should update channel fields', async () => {
      const dto = new UpdateChannelFieldsRequestDto();
      const fieldDto = new UpdateChannelRequestFieldDto();
      fieldDto.id = 5;
      fieldDto.format = FieldFormatEnum.text;
      fieldDto.key = 'testField';
      fieldDto.name = 'TestFieldUpdated';
      dto.fields = [fieldDto];

      await request(app.getHttpServer() as Server)
        .put(`/admin/projects/${project.id}/channels/1/fields`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(200);

      await request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/channels/1`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then(({ body }: { body: FindChannelByIdResponseDto }) => {
          expect(body.fields.length).toBe(5);
          expect(body.fields[4].name).toBe('TestFieldUpdated');
        });
    });

    it('should return 400 error when update channel field key with special character', async () => {
      const dto = new UpdateChannelFieldsRequestDto();
      const fieldDto = new UpdateChannelRequestFieldDto();
      fieldDto.id = 5;
      fieldDto.format = FieldFormatEnum.text;
      fieldDto.key = 'testField!';
      fieldDto.name = 'testField!';
      dto.fields = [fieldDto];

      await request(app.getHttpServer() as Server)
        .put(`/admin/projects/${project.id}/channels/1/fields`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(400);
    });
  });

  describe('/admin/projects/:projectId/channels/:channelId (DELETE)', () => {
    it('should delete channel', async () => {
      await request(app.getHttpServer() as Server)
        .delete(`/admin/projects/${project.id}/channels/1`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const dto = new FindChannelsByProjectIdRequestDto();
      dto.page = 1;
      dto.limit = 10;
      return request(app.getHttpServer() as Server)
        .get(`/admin/projects/${project.id}/channels`)
        .set('Authorization', `Bearer ${accessToken}`)
        .query(dto)
        .expect(200)
        .then(({ body }: { body: FindChannelsByProjectIdResponseDto }) => {
          expect(body.items.length).toBe(0);
        });
    });

    it('should return 401 when unauthorized', async () => {
      await request(app.getHttpServer() as Server)
        .delete(`/admin/projects/${project.id}/channels/1`)
        .expect(401);
    });
  });

  describe('Channel validation tests', () => {
    it('should return 400 when creating channel with invalid field key', async () => {
      const dto = new CreateChannelRequestDto();
      dto.name = 'TestChannel';

      const fieldDto = new CreateChannelRequestFieldDto();
      fieldDto.name = 'TestField';
      fieldDto.key = 'invalid-key!@#';
      fieldDto.format = FieldFormatEnum.text;
      fieldDto.property = FieldPropertyEnum.EDITABLE;
      fieldDto.status = FieldStatusEnum.ACTIVE;

      dto.fields = [fieldDto];

      return request(app.getHttpServer() as Server)
        .post(`/admin/projects/${project.id}/channels`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(400);
    });

    it('should return 400 when updating channel with invalid data', async () => {
      const dto = new UpdateChannelRequestDto();
      dto.name = '';

      return request(app.getHttpServer() as Server)
        .put(`/admin/projects/${project.id}/channels/1`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
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
