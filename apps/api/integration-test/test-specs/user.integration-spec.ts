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
import { DateTime } from 'luxon';
import request from 'supertest';
import type { DataSource, Repository } from 'typeorm';

import { AppModule } from '@/app.module';
import { AuthService } from '@/domains/admin/auth/auth.service';
import { RoleEntity } from '@/domains/admin/project/role/role.entity';
import { TenantService } from '@/domains/admin/tenant/tenant.service';
import type { UserDto } from '@/domains/admin/user/dtos';
import type { GetAllUserResponseDto } from '@/domains/admin/user/dtos/responses/get-all-user-response.dto';
import { UserStateEnum } from '@/domains/admin/user/entities/enums';
import { UserEntity } from '@/domains/admin/user/entities/user.entity';
import {
  clearEntities,
  createTenant,
  getRandomEnumValue,
  signInTestUser,
} from '@/test-utils/util-functions';
import { HttpStatusCode } from '@/types/http-status';

describe('UserController (integration)', () => {
  let app: INestApplication;

  let dataSource: DataSource;
  let userRepo: Repository<UserEntity>;
  let roleRepo: Repository<RoleEntity>;

  let tenantService: TenantService;

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
    userRepo = dataSource.getRepository(UserEntity);
    roleRepo = dataSource.getRepository(RoleEntity);
    authService = module.get(AuthService);
    tenantService = module.get(TenantService);

    await createTenant(tenantService);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  let total: number;
  let userEntities: UserEntity[];
  let accessToken: string;
  let ownerUser: UserEntity;

  beforeEach(async () => {
    await clearEntities([userRepo, roleRepo]);

    const length = faker.number.int({ min: 3, max: 8 });

    userEntities = (
      await userRepo.save(
        Array.from({ length: length }).map(() => ({
          email: faker.internet.email(),
          state: getRandomEnumValue(UserStateEnum),
          hashPassword: faker.internet.password(),
        })),
      )
    ).sort((a, b) =>
      DateTime.fromJSDate(b.createdAt)
        .diff(DateTime.fromJSDate(a.createdAt))
        .as('milliseconds'),
    );

    const { jwt, user } = await signInTestUser(dataSource, authService);
    accessToken = jwt.accessToken;
    ownerUser = user;

    total = length + 1;
  });

  describe('/admin/users (GET)', () => {
    it('should return all users', async () => {
      const expectUsers = userEntities
        .concat(ownerUser)
        .sort((a, b) =>
          DateTime.fromJSDate(a.createdAt)
            .diff(DateTime.fromJSDate(b.createdAt))
            .as('milliseconds'),
        )
        .map(({ id, email }) => ({
          id,
          email,
        }))
        .slice(0, 10);

      return request(app.getHttpServer() as Server)
        .get('/admin/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatusCode.OK)
        .expect(({ body }) => {
          expect(body).toHaveProperty('items');
          expect(body).toHaveProperty('meta');

          const { items, meta } = body as GetAllUserResponseDto;
          [
            'name',
            'department',
            'type',
            'members',
            'createdAt',
            'signUpMethod',
          ].forEach((field) => items.forEach((item) => delete item[field]));
          expect(items).toEqual(expectUsers);
          expect(meta.totalItems).toEqual(total);
        });
    });

    it('should return unauthorized status code', async () => {
      return request(app.getHttpServer() as Server)
        .get('/admin/users')
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
  });

  describe('/admin/users (DELETE)', () => {
    it('should return empty result', async () => {
      const ids = faker.helpers.arrayElements(userEntities).map((v) => v.id);

      await request(app.getHttpServer() as Server)
        .delete(`/admin/users`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ids })
        .expect(HttpStatusCode.OK)
        .then(async () => {
          for (const id of ids) {
            const result = await userRepo.findOneBy({ id });
            expect(result).toBeNull();
          }
        });
    });

    it('should return unauthorized status code', async () => {
      await request(app.getHttpServer() as Server)
        .delete(`/admin/users`)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
  });

  describe('/admin/users/:id (GET)', () => {
    it('check signed-in user', async () => {
      await request(app.getHttpServer() as Server)
        .get(`/admin/users/${ownerUser.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect(({ body }) => {
          expect((body as UserDto).id).toEqual(ownerUser.id);
          expect((body as UserDto).email).toEqual(ownerUser.email);
        });
    });
    it('should return unauthorized status code', async () => {
      await request(app.getHttpServer() as Server)
        .get(`/admin/users/${ownerUser.id}`)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
  });

  describe('/admin/users/:id (DELETE)', () => {
    it('should return empty result', async () => {
      return request(app.getHttpServer() as Server)
        .delete(`/admin/users/${ownerUser.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatusCode.OK)
        .then(async () => {
          const result = await userRepo.findOneBy({ id: ownerUser.id });
          expect(result).toBeNull();
        });
    });
    it('should return unauthorized status code', async () => {
      return request(app.getHttpServer() as Server)
        .delete(`/admin/users/${faker.number.int()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
    it('should return unauthorized status code', async () => {
      return request(app.getHttpServer() as Server)
        .delete(`/admin/users/${ownerUser.id}`)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
  });

  describe('/admin/users/:id/roles (GET)', () => {
    it('should return OK', async () => {
      await request(app.getHttpServer() as Server)
        .get(`/admin/users/${ownerUser.id}/roles`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatusCode.OK);
    });
  });

  describe('/admin/users/:id/roles (PUT)', () => {
    it('should return unauthorized status code', async () => {
      const role = await roleRepo.save({
        name: faker.string.sample(),
        permissions: [],
      });

      await request(app.getHttpServer() as Server)
        .put(`/admin/users/${ownerUser.id}`)
        .send({ roleId: role.id })
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
  });
});
