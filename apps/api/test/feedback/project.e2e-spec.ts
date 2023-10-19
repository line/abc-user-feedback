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
import { HttpExceptionFilter } from '@/common/filters';
import { CreateProjectRequestDto } from '@/domains/project/project/dtos/requests';
import { ProjectEntity } from '@/domains/project/project/project.entity';
import { clearEntities } from '@/utils/test-utils';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let dataSource: DataSource;
  let projectRepo: Repository<ProjectEntity>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );

    await app.init();

    dataSource = module.get(getDataSourceToken());
    projectRepo = dataSource.getRepository(ProjectEntity);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  beforeEach(async () => {
    await clearEntities([projectRepo]);
  });

  it('/projects (GET)', async () => {
    const total = faker.number.int(10);

    await projectRepo.save(
      Array.from({ length: total }).map(() => ({
        name: faker.string.sample(),
        description: faker.string.sample(),
      })),
    );

    return request(app.getHttpServer())
      .get('/projects')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('items');
        expect(body).toHaveProperty('meta');

        expect(Array.isArray(body.items)).toEqual(true);
        for (const project of body.items) {
          expect(project).toHaveProperty('id');
          expect(project).toHaveProperty('name');
          expect(project).toHaveProperty('description');
        }
        expect(body.meta.totalItems).toEqual(total);
      });
  });

  it('/projects (POST)', () => {
    const dto = new CreateProjectRequestDto();
    dto.name = faker.string.sample();
    dto.description = faker.string.sample();

    return request(app.getHttpServer()).post('/projects').send(dto).expect(201);
  });

  it('/projects/:id (GET)', async () => {
    const project = await projectRepo.save({
      name: faker.string.sample(),
      description: faker.string.sample(),
    });

    return request(app.getHttpServer())
      .get('/projects/' + project.id)
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toEqual(project.id);
        expect(body.name).toEqual(project.name);
        expect(body.description).toEqual(project.description);
      });
  });
  it('/projects/:id (PUT)', async () => {
    const project = await projectRepo.save({
      name: faker.string.sample(),
      description: faker.string.sample(),
    });

    const name = faker.string.sample();
    const description = faker.string.sample();

    return request(app.getHttpServer())
      .put(`/projects/${project.id}`)
      .send({ name, description })
      .expect(200)
      .then(async () => {
        const updatedproject = await projectRepo.findOneBy({ id: project.id });
        expect(updatedproject.name).toEqual(name);
        expect(updatedproject.description).toEqual(description);
      });
  });
  // it('/projects/:id (DELETE)', async () => {
  //   const project = await projectModel.create({
  //     name: faker.string.sample(),
  //     description: faker.string.sample(),
  //   });

  //   await request(app.getHttpServer())
  //     .delete(`/projects/${project.id}`)
  //     .expect(200)
  //     .then(async () => {
  //       expect(await projectModel.findById(project.id)).toBeNull();
  //     });
  //   expect(await projectModel.findById(project.id)).toBeNull();
  // });
});
