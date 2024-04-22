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
import { UpdateRoleRequestDto } from '@/domains/admin/project/role/dtos/requests';
import { PermissionEnum } from '@/domains/admin/project/role/permission.enum';
import { RoleEntity } from '@/domains/admin/project/role/role.entity';
import {
  clearEntities,
  getRandomEnumValues,
  signInTestUser,
} from '@/test-utils/util-functions';
import { HttpStatusCode } from '@/types/http-status';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let dataSource: DataSource;
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
    roleRepo = dataSource.getRepository(RoleEntity);

    authService = module.get(AuthService);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  let accessToken: string;
  beforeEach(async () => {
    await clearEntities([roleRepo]);
    const { jwt } = await signInTestUser(dataSource, authService);
    accessToken = jwt.accessToken;
  });

  describe('/roles (GET)', () => {
    it('positive case', async () => {
      const total = faker.number.int(20);
      for (let i = 0; i < total; i++) {
        await roleRepo.save({
          name: faker.string.sample(),
          permissions: getRandomEnumValues(PermissionEnum),
        });
      }
      return request(app.getHttpServer())
        .get('/roles')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatusCode.OK)
        .expect(({ body }) => {
          expect(body).toHaveProperty('roles');
          expect(Array.isArray(body.roles)).toEqual(true);

          for (const role of body.roles) {
            expect(role).toHaveProperty('id');
            expect(role).toHaveProperty('name');
            expect(role).toHaveProperty('permissions');
          }

          expect(body).toHaveProperty('total');
          expect(body.total).toEqual(total + 1);
        });
    });
    it('Unauthroized', async () => {
      return request(app.getHttpServer())
        .get('/roles')
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
  });

  describe('/roles (POST)', () => {
    it('positive case', () => {
      return request(app.getHttpServer())
        .post('/roles')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: faker.string.sample(),
          permissions: getRandomEnumValues(PermissionEnum),
        })
        .expect(201);
    });
    it('Unauthroized', () => {
      return request(app.getHttpServer())
        .post('/roles')
        .send({
          name: faker.string.sample(),
          permissions: getRandomEnumValues(PermissionEnum),
        })
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
  });

  it('/roles/:id (GET)', async () => {
    const role = await roleRepo.save({
      name: faker.string.sample(),
      permissions: getRandomEnumValues(PermissionEnum),
    });

    return request(app.getHttpServer())
      .get('/roles/' + role.id)
      .expect(HttpStatusCode.OK)
      .expect(({ body }) => {
        expect(body.id).toEqual(role.id);
        expect(body.name).toEqual(role.name);
        expect(body.permissions).toEqual(role.permissions);
      });
  });
  describe('/roles/:id (PUT)', () => {
    it('positive case', async () => {
      const role = await roleRepo.save({
        name: faker.string.sample(),
        permissions: getRandomEnumValues(PermissionEnum),
      });

      const dto = new UpdateRoleRequestDto();
      dto.name = 'updatedRole';
      dto.permissions = getRandomEnumValues(PermissionEnum);

      await request(app.getHttpServer())
        .put(`/roles/${role.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(dto)
        .expect(204)
        .then(async () => {
          const updatedRole = await roleRepo.findOneBy({ id: role.id });
          expect(updatedRole.name).toEqual(dto.name);
          expect(updatedRole.permissions).toEqual(dto.permissions);
        });
    });
    it('Unauthrized', async () => {
      await request(app.getHttpServer())
        .put(`/roles/${faker.number.int()}`)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
  });
  describe('/roles/:id (DELETE)', () => {
    it('positive case', async () => {
      const role = await roleRepo.save({
        name: faker.string.sample(),
        permissions: getRandomEnumValues(PermissionEnum),
      });

      await request(app.getHttpServer())
        .delete(`/roles/${role.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(HttpStatusCode.OK)
        .then(async () => {
          expect(await roleRepo.findOneBy({ id: role.id })).toBeNull();
        });
    });
    it('Unauthrized', async () => {
      await request(app.getHttpServer())
        .delete(`/roles/${faker.number.int()}`)
        .expect(HttpStatusCode.UNAUTHORIZED);
    });
  });
});
