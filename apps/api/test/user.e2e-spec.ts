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
import type { UserDto } from '@/domains/admin/user/dtos';
import type { GetAllUserResponseDto } from '@/domains/admin/user/dtos/responses/get-all-user-response.dto';
import { UserStateEnum } from '@/domains/admin/user/entities/enums';
import { UserEntity } from '@/domains/admin/user/entities/user.entity';
import {
  clearEntities,
  getRandomEnumValue,
  signInTestUser,
} from '@/test-utils/util-functions';
import { HttpStatusCode } from '@/types/http-status';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let dataSource: DataSource;
  let userRepo: Repository<UserEntity>;
  let roleRepo: Repository<RoleEntity>;

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

    const length = faker.number.int({ min: 20, max: 30 });

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

  describe('/users (GET)', () => {
    it('no query', async () => {
      const expectUsers = userEntities
        .concat(ownerUser)
        .sort((a, b) =>
          DateTime.fromJSDate(b.createdAt)
            .diff(DateTime.fromJSDate(a.createdAt))
            .as('milliseconds'),
        )
        .map(({ id, email }) => ({
          id,
          email,
        }))
        .slice(0, 10);

      return request(app.getHttpServer() as Server)
        .get('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatusCode.OK)
        .expect(({ body }) => {
          expect(body).toHaveProperty('items');
          expect(body).toHaveProperty('meta');

          const { items, meta } = body as GetAllUserResponseDto;
          expect(items).toEqual(expectUsers);
          expect(meta.totalItems).toEqual(total);
          expect(meta.itemCount).toEqual(10);
        });
    });

    it('UnAuthorized', async () => {
      return request(app.getHttpServer() as Server)
        .get('/users')
        .expect(HttpStatusCode.UNAUTHORIZED);
    });

    it('page and limit', async () => {
      const limit = faker.number.int({ min: 1, max: 10 });
      const page = faker.number.int({
        min: 1,
        max: Math.floor(total / limit),
      });

      const expectUsers = userEntities
        .concat(ownerUser)
        .sort((a, b) =>
          DateTime.fromJSDate(b.createdAt)
            .diff(DateTime.fromJSDate(a.createdAt))
            .as('milliseconds'),
        )
        .map(({ id, email }) => ({
          id,
          email,
        }))
        .slice((page - 1) * limit, page * limit);

      return request(app.getHttpServer() as Server)
        .get(`/users?page=${page}&limit=${limit}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatusCode.OK)
        .expect(({ body }) => {
          expect(body).toHaveProperty('items');
          expect(body).toHaveProperty('meta');

          const { items, meta } = body as GetAllUserResponseDto;
          expect(items).toEqual(expectUsers);
          expect(meta.totalItems).toEqual(total);
          expect(meta.itemCount).toBeLessThanOrEqual(10);
        });
    });
  });

  describe('/users (DELETE)', () => {
    it('positive case', async () => {
      const ids = faker.helpers.arrayElements(userEntities).map((v) => v.id);

      await request(app.getHttpServer() as Server)
        .delete(`/users`)
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

    it('Unauthorized', async () => {
      await request(app.getHttpServer() as Server)
        .delete(`/users`)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
  });

  describe('/users/:id (GET)', () => {
    it('', async () => {
      await request(app.getHttpServer() as Server)
        .get(`/users/${ownerUser.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect(({ body }) => {
          expect((body as UserDto).id).toEqual(ownerUser.id);
          expect((body as UserDto).email).toEqual(ownerUser.email);
        });
    });
    it('', async () => {
      await request(app.getHttpServer() as Server)
        .get(`/users/${ownerUser.id}`)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
  });
  describe('/users/:id (DELETE)', () => {
    it('positive', async () => {
      return request(app.getHttpServer() as Server)
        .delete(`/users/${ownerUser.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatusCode.OK)
        .then(async () => {
          const result = await userRepo.findOneBy({ id: ownerUser.id });
          expect(result).toBeNull();
        });
    });
    it('Unauthorization', async () => {
      return request(app.getHttpServer() as Server)
        .delete(`/users/${faker.number.int()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
    it('Unauthorization', async () => {
      return request(app.getHttpServer() as Server)
        .delete(`/users/${ownerUser.id}`)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
  });

  describe('/users/:id/role (PUT)', () => {
    it('positive case', async () => {
      const role = await roleRepo.save({
        name: faker.string.sample(),
        permissions: [],
      });

      await request(app.getHttpServer() as Server)
        .put(`/users/${ownerUser.id}/role`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ roleId: role.id })
        .expect(HttpStatusCode.NO_CONTENT);
    });
    it('Unauthroized', async () => {
      const role = await roleRepo.save({
        name: faker.string.sample(),
        permissions: [],
      });

      await request(app.getHttpServer() as Server)
        .put(`/users/${ownerUser.id}/role`)
        .send({ roleId: role.id })
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
  });
  // it('', async () => {
  //   await request(app.getHttpServer())
  //     .put(`/users/password/reset/code`)
  //     .expect(204);
  // });
  // it('', async () => {
  //   await request(app.getHttpServer()).put(`/users/password/reset`).expect(204);
  // });
  // it('', async () => {
  //   await request(app.getHttpServer())
  //     .put(`/users/password/change`)
  //     .expect(204);
  // });
});
