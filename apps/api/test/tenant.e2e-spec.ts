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
import { ValidationPipe } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import request from 'supertest';
import type { DataSource, Repository } from 'typeorm';

import { AppModule } from '@/app.module';
import { AuthService } from '@/domains/admin/auth/auth.service';
import {
  SetupTenantRequestDto,
  UpdateTenantRequestDto,
} from '@/domains/admin/tenant/dtos/requests';
import type { GetTenantResponseDto } from '@/domains/admin/tenant/dtos/responses/get-tenant-response.dto';
import { TenantEntity } from '@/domains/admin/tenant/tenant.entity';
import { clearEntities, signInTestUser } from '@/test-utils/util-functions';
import { HttpStatusCode } from '@/types/http-status';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let dataSource: DataSource;
  let tenantRepo: Repository<TenantEntity>;
  let authService: AuthService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();

    dataSource = module.get(getDataSourceToken());
    tenantRepo = dataSource.getRepository(TenantEntity);

    authService = module.get(AuthService);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  beforeEach(async () => {
    await clearEntities([tenantRepo]);
  });

  describe('/tenant (POST)', () => {
    it('setup', async () => {
      const dto = new SetupTenantRequestDto();
      dto.siteName = faker.string.sample();

      return request(app.getHttpServer() as Server)
        .post('/tenant')
        .send(dto)
        .expect(201)
        .then(async () => {
          const tenants = await tenantRepo.find();
          expect(tenants).toHaveLength(1);
          const [tenant] = tenants;
          for (const key in dto) {
            const value = dto[key] as string;
            expect(tenant[key]).toEqual(value);
          }
        });
    });
    it('already exists', async () => {
      await tenantRepo.save({
        siteName: faker.string.sample(),
        allowDomains: [],
      });
      const dto = new SetupTenantRequestDto();
      dto.siteName = faker.string.sample();

      return request(app.getHttpServer() as Server)
        .post('/tenant')
        .send(dto)
        .expect(400);
    });
  });
  describe('/tenant (PUT)', () => {
    let tenant: TenantEntity;
    let accessToken: string;
    beforeEach(async () => {
      tenant = await tenantRepo.save({
        siteName: faker.string.sample(),
        allowDomains: [],
      });
      const { jwt } = await signInTestUser(dataSource, authService);
      accessToken = jwt.accessToken;
    });
    it('update', async () => {
      const dto = new UpdateTenantRequestDto();

      dto.siteName = faker.string.sample();
      dto.allowDomains = [];

      return request(app.getHttpServer() as Server)
        .put('/tenant')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(204)
        .then(async () => {
          const updatedTenant = await tenantRepo.findOne({
            where: { id: tenant.id },
          });
          expect(updatedTenant?.siteName).toEqual(dto.siteName);
          expect(updatedTenant?.allowDomains).toEqual(dto.allowDomains);
        });
    });
    it('not found tenant', async () => {
      await tenantRepo.delete({ id: tenant.id });

      const dto = new UpdateTenantRequestDto();

      dto.siteName = faker.string.sample();
      dto.allowDomains = [];

      return request(app.getHttpServer() as Server)
        .put('/tenant')
        .set('Authorization', `Bearer ${accessToken}`)

        .send(dto)
        .expect(404);
    });
    it('not found role', async () => {
      const dto = new UpdateTenantRequestDto();

      dto.siteName = faker.string.sample();
      dto.allowDomains = [];

      return request(app.getHttpServer() as Server)
        .put('/tenant')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(404);
    });
    it('unauthorized', async () => {
      const dto = new UpdateTenantRequestDto();

      dto.siteName = faker.string.sample();
      dto.allowDomains = [];

      return request(app.getHttpServer() as Server)
        .put('/tenant')
        .send(dto)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
  });
  describe('/tenant (GET)', () => {
    const dto = new SetupTenantRequestDto();
    beforeEach(async () => {
      dto.siteName = faker.string.sample();

      await request(app.getHttpServer() as Server)
        .post('/tenant')
        .send(dto);
    });

    it('find', async () => {
      await request(app.getHttpServer() as Server)
        .get('/tenant')
        .expect(200)
        .expect(({ body }) => {
          expect(dto.siteName).toEqual((body as GetTenantResponseDto).siteName);
        });
    });
  });
});
