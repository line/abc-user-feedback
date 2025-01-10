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
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import request from 'supertest';
import type { DataSource, Repository } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from '@/app.module';
import { AuthService } from '@/domains/admin/auth/auth.service';
import {
  SetupTenantRequestDto,
  UpdateTenantRequestDto,
} from '@/domains/admin/tenant/dtos/requests';
import type { GetTenantResponseDto } from '@/domains/admin/tenant/dtos/responses';
import { TenantEntity } from '@/domains/admin/tenant/tenant.entity';
import { UserEntity } from '@/domains/admin/user/entities/user.entity';
import { clearAllEntities, signInTestUser } from '@/test-utils/util-functions';
import { HttpStatusCode } from '@/types/http-status';

describe('TenantController (integration)', () => {
  let module: TestingModule;
  let app: INestApplication;

  let dataSource: DataSource;
  let tenantRepo: Repository<TenantEntity>;
  let userRepo: Repository<UserEntity>;

  let authService: AuthService;

  beforeAll(async () => {
    initializeTransactionalContext();
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    dataSource = module.get(getDataSourceToken());
    tenantRepo = dataSource.getRepository(TenantEntity);
    userRepo = dataSource.getRepository(UserEntity);

    authService = module.get(AuthService);

    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await clearAllEntities(module);
  });

  describe('/admin/tenants (POST)', () => {
    it('should create a tenant', async () => {
      const dto = new SetupTenantRequestDto();
      dto.siteName = faker.string.sample();
      dto.password = '12345678';

      return await request(app.getHttpServer() as Server)
        .post('/admin/tenants')
        .send(dto)
        .expect(201)
        .then(async () => {
          const tenants = await tenantRepo.find();
          expect(tenants).toHaveLength(1);
          const [tenant] = tenants;
          for (const key in dto) {
            if (['email', 'password'].includes(key)) continue;
            const value = dto[key] as string;
            expect(tenant[key]).toEqual(value);
          }
        });
    });
    it('should return bad request since tenant is already exists', async () => {
      await tenantRepo.save({
        siteName: faker.string.sample(),
        allowDomains: [],
      });
      const dto = new SetupTenantRequestDto();
      dto.siteName = faker.string.sample();
      dto.password = '12345678';

      return request(app.getHttpServer() as Server)
        .post('/admin/tenants')
        .send(dto)
        .expect(400);
    });

    afterAll(async () => {
      await tenantRepo.delete({});
    });
  });

  describe('/admin/tenants (PUT)', () => {
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
    it('should update a tenant', async () => {
      const dto = new UpdateTenantRequestDto();

      dto.siteName = faker.string.sample();
      dto.allowDomains = [];

      return await request(app.getHttpServer() as Server)
        .put('/admin/tenants')
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
    it('should fail to find a tenant', async () => {
      await tenantRepo.delete({});

      const dto = new UpdateTenantRequestDto();

      dto.siteName = faker.string.sample();
      dto.allowDomains = [];

      return request(app.getHttpServer() as Server)
        .put('/admin/tenants')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(404);
    });
    it('should reject the request when unauthorized', async () => {
      const dto = new UpdateTenantRequestDto();

      dto.siteName = faker.string.sample();
      dto.allowDomains = [];

      return await request(app.getHttpServer() as Server)
        .put('/admin/tenants')
        .send(dto)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
  });

  describe('/admin/tenants (GET)', () => {
    const dto = new SetupTenantRequestDto();
    beforeEach(async () => {
      await tenantRepo.delete({});
      await userRepo.delete({});
      dto.siteName = faker.string.sample();
      dto.password = '12345678';

      await request(app.getHttpServer() as Server)
        .post('/admin/tenants')
        .send(dto);
    });

    it('should find a tenant', async () => {
      await request(app.getHttpServer() as Server)
        .get('/admin/tenants')
        .expect(200)
        .expect(({ body }) => {
          expect(dto.siteName).toEqual((body as GetTenantResponseDto).siteName);
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
