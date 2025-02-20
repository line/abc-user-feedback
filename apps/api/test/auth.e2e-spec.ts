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
import { JwtService } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import request from 'supertest';
import type { DataSource, Repository } from 'typeorm';

import { CodeTypeEnum } from '@/shared/code/code-type.enum';
import { CodeEntity } from '@/shared/code/code.entity';
import { CodeService } from '@/shared/code/code.service';

import { AppModule } from '@/app.module';
import {
  EmailUserSignInRequestDto,
  EmailUserSignUpRequestDto,
  EmailVerificationCodeRequestDto,
  EmailVerificationMailingRequestDto,
  InvitationUserSignUpRequestDto,
} from '@/domains/admin/auth/dtos/requests';
import type { SignInResponseDto } from '@/domains/admin/auth/dtos/responses/sign-in-response.dto';
import { TenantEntity } from '@/domains/admin/tenant/tenant.entity';
import { UserDto } from '@/domains/admin/user/dtos/user.dto';
import {
  UserStateEnum,
  UserTypeEnum,
} from '@/domains/admin/user/entities/enums';
import { UserEntity } from '@/domains/admin/user/entities/user.entity';
import { UserPasswordService } from '@/domains/admin/user/user-password.service';
import { clearEntities } from '@/test-utils/util-functions';

interface JwtPayload {
  sub: number;
  email: string;
  permissions: string[];
  roleName: string;
}

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let codeService: CodeService;
  let userPasswordService: UserPasswordService;
  let jwtService: JwtService;

  let dataSource: DataSource;
  let userRepo: Repository<UserEntity>;
  let codeRepo: Repository<CodeEntity>;
  let tenantRepo: Repository<TenantEntity>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dataSource = module.get(getDataSourceToken());
    userRepo = dataSource.getRepository(UserEntity);
    codeRepo = dataSource.getRepository(CodeEntity);
    tenantRepo = dataSource.getRepository(TenantEntity);

    codeService = module.get(CodeService);
    userPasswordService = module.get(UserPasswordService);
    jwtService = module.get(JwtService);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  beforeEach(async () => {
    await clearEntities([userRepo, codeRepo, tenantRepo]);

    await tenantRepo.save({
      allowDomains: [],
      siteName: faker.string.sample(),
    });
  });

  describe('/auth/email/code (POST)', () => {
    it('positive case', async () => {
      const dto = new EmailVerificationMailingRequestDto();
      dto.email = faker.internet.email();

      return request(app.getHttpServer() as Server)
        .post('/auth/email/code')
        .send(dto)
        .expect(201)
        .expect(({ body }) => {
          expect(body).toHaveProperty('expiredAt');
        });
    });
    it('same email user already exists', async () => {
      const user = await userRepo.save({
        email: faker.internet.email(),
        hashPassword: faker.internet.password(),
        state: UserStateEnum.Active,
      });

      const dto = new EmailVerificationMailingRequestDto();
      dto.email = user.email;

      return request(app.getHttpServer() as Server)
        .post('/auth/email/code')
        .send(dto)
        .expect(400);
    });
  });
  describe('/auth/email/code/verify (POST)', () => {
    let email: string;
    let code: string;
    beforeEach(async () => {
      email = faker.internet.email();

      code = await codeService.setCode({
        type: CodeTypeEnum.EMAIL_VEIRIFICATION,
        key: email,
      });
    });
    it('positive', async () => {
      const dto = new EmailVerificationCodeRequestDto();
      dto.email = email;
      dto.code = code;

      const originalCode = await codeRepo.findOneBy({ code });
      expect(originalCode?.isVerified).toEqual(false);

      await request(app.getHttpServer() as Server)
        .post('/auth/email/code/verify')
        .send(dto)
        .expect(200);

      const updatedCode = await codeRepo.findOneBy({ code });
      expect(updatedCode?.isVerified).toEqual(true);
    });
    it('invalid code', async () => {
      const dto = new EmailVerificationCodeRequestDto();
      dto.email = email;
      dto.code = faker.string.sample();

      const originalCode = await codeRepo.findOneBy({ code });
      expect(originalCode?.isVerified).toEqual(false);

      return request(app.getHttpServer() as Server)
        .post('/auth/email/code/verify')
        .send(dto)
        .expect(400)
        .then(async () => {
          const updatedCode = await codeRepo.findOneBy({ code });
          expect(updatedCode?.isVerified).toEqual(false);
        });
    });
    it('invalid email', async () => {
      const dto = new EmailVerificationCodeRequestDto();
      dto.email = faker.internet.email();
      dto.code = code;

      return request(app.getHttpServer() as Server)
        .post('/auth/email/code/verify')
        .send(dto)
        .expect(404);
    });
  });
  describe('/auth/signUp/email', () => {
    let email: string;
    const setCode = async (email: string) =>
      await codeService.setCode({
        type: CodeTypeEnum.EMAIL_VEIRIFICATION,
        key: email,
      });

    const verifyEmail = async (code: string, email: string) =>
      await codeService.verifyCode({
        type: CodeTypeEnum.EMAIL_VEIRIFICATION,
        code,
        key: email,
      });

    beforeEach(() => {
      email = faker.internet.email();
    });

    it('positive', async () => {
      const code = await setCode(email);
      await verifyEmail(code, email);

      const dto = new EmailUserSignUpRequestDto();
      dto.email = email;
      dto.password = faker.internet.password();

      return request(app.getHttpServer() as Server)
        .post('/auth/signUp/email')
        .send(dto)
        .expect(201)
        .then(async () => {
          const user = await userRepo.findOneBy({ email });
          expect(user).toBeDefined();
        });
    });

    it('must verfy email', async () => {
      const dto = new EmailUserSignUpRequestDto();
      dto.email = faker.internet.email();
      dto.password = faker.internet.password();

      return request(app.getHttpServer() as Server)
        .post('/auth/signUp/email')
        .send(dto)
        .expect(400);
    });

    it('not verified email', async () => {
      await setCode(email);

      const dto = new EmailUserSignUpRequestDto();
      dto.email = faker.internet.email();
      dto.password = faker.internet.password();

      return request(app.getHttpServer() as Server)
        .post('/auth/signUp/email')
        .send(dto)
        .expect(400);
    });
    it('same email', async () => {
      await userRepo.save({
        email,
        hashPassword: faker.internet.password(),
        state: UserStateEnum.Active,
      });

      const code = await setCode(email);
      await verifyEmail(code, email);

      const dto = new EmailUserSignUpRequestDto();
      dto.email = email;
      dto.password = faker.internet.password();

      return request(app.getHttpServer() as Server)
        .post('/auth/signUp/email')
        .send(dto)
        .expect(400);
    });
  });
  describe('/auth/signUp/invitation (POST)', () => {
    let email: string;
    const setCode = async (email: string) =>
      await codeService.setCode({
        type: CodeTypeEnum.USER_INVITATION,
        key: email,
        data: {
          roleId: 1,
          userType: UserTypeEnum.GENERAL,
          invitedBy: new UserDto(),
        },
      });

    beforeEach(() => {
      email = faker.internet.email();
    });

    it('positive case', async () => {
      const code = await setCode(email);
      const dto = new InvitationUserSignUpRequestDto();
      dto.code = code;
      dto.email = email;
      dto.password = faker.internet.password();
      return request(app.getHttpServer() as Server)
        .post('/auth/signUp/invitation')
        .send(dto)
        .expect(201);
    });
    it('no invitation', async () => {
      const dto = new InvitationUserSignUpRequestDto();
      dto.code = faker.string.sample();
      dto.email = email;
      dto.password = faker.internet.password();

      return request(app.getHttpServer() as Server)
        .post('/auth/signUp/invitation')
        .send(dto)
        .expect(400);
    });
    it('invalid code', async () => {
      await setCode(email);

      const dto = new InvitationUserSignUpRequestDto();
      dto.code = faker.string.sample();
      dto.email = email;
      dto.password = faker.internet.password();

      return request(app.getHttpServer() as Server)
        .post('/auth/signUp/invitation')
        .send(dto)
        .expect(400);
    });
    it('invalid email', async () => {
      const code = await setCode(email);

      const dto = new InvitationUserSignUpRequestDto();
      dto.code = code;
      dto.email = faker.internet.email();
      dto.password = faker.internet.password();

      return request(app.getHttpServer() as Server)
        .post('/auth/signUp/invitation')
        .send(dto)
        .expect(400);
    });
  });
  describe('/auth/signIn/email (POST)', () => {
    let userEntity: UserEntity;
    let password: string;
    beforeEach(async () => {
      password = faker.internet.password();

      userEntity = await userRepo.save({
        email: faker.internet.email(),
        hashPassword: await userPasswordService.createHashPassword(password),
        state: UserStateEnum.Active,
      });
    });
    it('positive case', () => {
      const dto = new EmailUserSignInRequestDto();
      dto.email = userEntity.email;
      dto.password = password;

      return request(app.getHttpServer() as Server)
        .post('/auth/signIn/email')
        .send(dto)
        .expect(201)
        .expect(({ body }) => {
          expect(body).toHaveProperty('accessToken');
          expect(body).toHaveProperty('refreshToken');

          const payload = jwtService.verify<JwtPayload>(
            (body as SignInResponseDto).accessToken,
          );

          expect(payload.sub).toEqual(userEntity.id);
          expect(payload).toHaveProperty('email');
          expect(payload).toHaveProperty('permissions');
          expect(payload).toHaveProperty('roleName');
        });
    });

    it('invalid email', () => {
      const dto = new EmailUserSignInRequestDto();
      dto.email = faker.internet.email();
      dto.password = password;

      return request(app.getHttpServer() as Server)
        .post('/auth/signIn/email')
        .send(dto)
        .expect(404);
    });

    it('invalid password', () => {
      const dto = new EmailUserSignInRequestDto();
      dto.email = userEntity.email;
      dto.password = faker.internet.password();

      return request(app.getHttpServer() as Server)
        .post('/auth/signIn/email')
        .send(dto)
        .expect(401);
    });
  });
});
