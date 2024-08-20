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
import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from '@/app.module';

describe('FeedbackController (integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    initializeTransactionalContext();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (POST)', async () => {
    const response = await request(app.getHttpServer() as Server).get(
      '/admin/projects/1/channels',
    );

    console.log(response.body);
    console.log(response.status);
  });

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer() as Server).get(
      '/health',
    );

    console.log(response.body);
    console.log(response.status);
  });

  afterAll(async () => {
    await app.close();
  });
});
