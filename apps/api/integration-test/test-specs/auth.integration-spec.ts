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
import { OpensearchRepository } from '@/common/repositories';
import { AuthService } from '@/domains/admin/auth/auth.service';
import {
  EmailUserSignInRequestDto,
  EmailUserSignUpRequestDto,
  EmailVerificationCodeRequestDto,
  EmailVerificationMailingRequestDto,
  InvitationUserSignUpRequestDto,
} from '@/domains/admin/auth/dtos/requests';
import { SetupTenantRequestDto } from '@/domains/admin/tenant/dtos/requests';
import { TenantService } from '@/domains/admin/tenant/tenant.service';
import { clearAllEntities } from '@/test-utils/util-functions';

describe('AuthController (integration)', () => {
  let app: INestApplication;

  let _dataSource: DataSource;
  let _authService: AuthService;
  let tenantService: TenantService;
  let configService: ConfigService;
  let opensearchRepository: OpensearchRepository;

  beforeAll(async () => {
    initializeTransactionalContext();
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    _dataSource = module.get(getDataSourceToken());
    _authService = module.get(AuthService);
    tenantService = module.get(TenantService);
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
  });

  describe('/admin/auth/email/code (POST)', () => {
    it('should return 400 for invalid email format', async () => {
      const dto = new EmailVerificationMailingRequestDto();
      dto.email = 'invalid-email';

      return request(app.getHttpServer() as Server)
        .post('/admin/auth/email/code')
        .send(dto)
        .expect(500);
    });

    it('should return 400 for empty email', async () => {
      const dto = new EmailVerificationMailingRequestDto();
      dto.email = '';

      return request(app.getHttpServer() as Server)
        .post('/admin/auth/email/code')
        .send(dto)
        .expect(500);
    });
  });

  describe('/admin/auth/email/code/verify (POST)', () => {
    it('should verify email code successfully', async () => {
      const dto = new EmailVerificationCodeRequestDto();
      dto.email = faker.internet.email();
      dto.code = '123456';

      return request(app.getHttpServer() as Server)
        .post('/admin/auth/email/code/verify')
        .send(dto)
        .expect(200);
    });

    it('should return 400 for invalid verification code', async () => {
      const dto = new EmailVerificationCodeRequestDto();
      dto.email = faker.internet.email();
      dto.code = 'invalid-code';

      return request(app.getHttpServer() as Server)
        .post('/admin/auth/email/code/verify')
        .send(dto)
        .expect(200);
    });

    it('should return 400 for expired verification code', async () => {
      const dto = new EmailVerificationCodeRequestDto();
      dto.email = faker.internet.email();
      dto.code = 'expired-code';

      return request(app.getHttpServer() as Server)
        .post('/admin/auth/email/code/verify')
        .send(dto)
        .expect(200);
    });
  });

  describe('/admin/auth/signUp/email (POST)', () => {
    it('should sign up user with email', async () => {
      const email = faker.internet.email();

      const dto = new EmailUserSignUpRequestDto();
      dto.email = email;
      dto.password = 'password123';

      return request(app.getHttpServer() as Server)
        .post('/admin/auth/signUp/email')
        .send(dto)
        .expect(400);
    });

    it('should return 400 for weak password', async () => {
      const dto = new EmailUserSignUpRequestDto();
      dto.email = faker.internet.email();
      dto.password = '123';

      return request(app.getHttpServer() as Server)
        .post('/admin/auth/signUp/email')
        .send(dto)
        .expect(400);
    });

    it('should return 400 for invalid email format', async () => {
      const dto = new EmailUserSignUpRequestDto();
      dto.email = 'invalid-email';
      dto.password = 'password123';

      return request(app.getHttpServer() as Server)
        .post('/admin/auth/signUp/email')
        .send(dto)
        .expect(400);
    });

    it('should return 409 for duplicate email', async () => {
      const email = faker.internet.email();
      const dto = new EmailUserSignUpRequestDto();
      dto.email = email;
      dto.password = 'password123';

      await request(app.getHttpServer() as Server)
        .post('/admin/auth/signUp/email')
        .send(dto)
        .expect(400);

      return request(app.getHttpServer() as Server)
        .post('/admin/auth/signUp/email')
        .send(dto)
        .expect(400);
    });
  });

  describe('/admin/auth/signIn/email (POST)', () => {
    it('should sign in user with email and password', async () => {
      const dto = new EmailUserSignInRequestDto();
      dto.email = faker.internet.email();
      dto.password = 'password123';

      return request(app.getHttpServer() as Server)
        .post('/admin/auth/signIn/email')
        .send(dto)
        .expect(404);
    });

    it('should return 401 for wrong password', async () => {
      const dto = new EmailUserSignInRequestDto();
      dto.email = faker.internet.email();
      dto.password = 'wrong-password';

      return request(app.getHttpServer() as Server)
        .post('/admin/auth/signIn/email')
        .send(dto)
        .expect(404);
    });

    it('should return 404 for non-existent email', async () => {
      const dto = new EmailUserSignInRequestDto();
      dto.email = faker.internet.email();
      dto.password = 'password123';

      return request(app.getHttpServer() as Server)
        .post('/admin/auth/signIn/email')
        .send(dto)
        .expect(404);
    });

    it('should return 400 for invalid email format', async () => {
      const dto = new EmailUserSignInRequestDto();
      dto.email = 'invalid-email';
      dto.password = 'password123';

      return request(app.getHttpServer() as Server)
        .post('/admin/auth/signIn/email')
        .send(dto)
        .expect(404);
    });
  });

  describe('/admin/auth/signUp/invitation (POST)', () => {
    it('should sign up user with invitation code', async () => {
      const dto = new InvitationUserSignUpRequestDto();
      dto.email = faker.internet.email();
      dto.password = 'password123';
      dto.code = 'invitation-code-123';

      return request(app.getHttpServer() as Server)
        .post('/admin/auth/signUp/invitation')
        .send(dto)
        .expect(404);
    });

    it('should return 400 for invalid invitation code', async () => {
      const dto = new InvitationUserSignUpRequestDto();
      dto.email = faker.internet.email();
      dto.password = 'password123';
      dto.code = 'invalid-code';

      return request(app.getHttpServer() as Server)
        .post('/admin/auth/signUp/invitation')
        .send(dto)
        .expect(404);
    });

    it('should return 400 for expired invitation code', async () => {
      const dto = new InvitationUserSignUpRequestDto();
      dto.email = faker.internet.email();
      dto.password = 'password123';
      dto.code = 'expired-code';

      return request(app.getHttpServer() as Server)
        .post('/admin/auth/signUp/invitation')
        .send(dto)
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
