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
import { faker } from '@faker-js/faker';
import type { InjectionToken, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { DataSource, Repository } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';

import {
  FieldFormatEnum,
  FieldPropertyEnum,
  FieldStatusEnum,
} from '@/common/enums';
import { appConfig } from '@/configs/app.config';
import { jwtConfig, jwtConfigSchema } from '@/configs/jwt.config';
import {
  opensearchConfig,
  opensearchConfigSchema,
} from '@/configs/opensearch.config';
import { smtpConfig, smtpConfigSchema } from '@/configs/smtp.config';
import type { AuthService } from '@/domains/admin/auth/auth.service';
import { ChannelEntity } from '@/domains/admin/channel/channel/channel.entity';
import type { ChannelService } from '@/domains/admin/channel/channel/channel.service';
import { FieldEntity } from '@/domains/admin/channel/field/field.entity';
import type { CreateFeedbackDto } from '@/domains/admin/feedback/dtos';
import { FeedbackEntity } from '@/domains/admin/feedback/feedback.entity';
import type { FeedbackService } from '@/domains/admin/feedback/feedback.service';
import { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import type { ProjectService } from '@/domains/admin/project/project/project.service';
import { RoleEntity } from '@/domains/admin/project/role/role.entity';
import { SetupTenantRequestDto } from '@/domains/admin/tenant/dtos/requests';
import { TenantEntity } from '@/domains/admin/tenant/tenant.entity';
import type { TenantService } from '@/domains/admin/tenant/tenant.service';
import { UserDto } from '@/domains/admin/user/dtos';
import {
  UserStateEnum,
  UserTypeEnum,
} from '@/domains/admin/user/entities/enums';
import { UserEntity } from '@/domains/admin/user/entities/user.entity';
import { createFieldDto, getRandomValue } from '@/test-utils/fixtures';

initializeTransactionalContext();

export const getMockProvider = (
  injectToken: InjectionToken,
  factory: unknown,
): Provider => ({ provide: injectToken, useFactory: () => factory });

export const TestConfig = ConfigModule.forRoot({
  load: [appConfig, smtpConfig, jwtConfig, opensearchConfig],
  envFilePath: '.env.test',
  validationSchema: smtpConfigSchema
    .concat(jwtConfigSchema)
    .concat(opensearchConfigSchema),
});

export const MockDataSource = {
  initialize: jest.fn(),
};

export const getRandomEnumValue = <T extends object>(anEnum: T): T[keyof T] => {
  const enumValues = Object.keys(anEnum) as (keyof T)[];
  const randomIndex = faker.number.int(enumValues.length - 1);
  const randomEnumKey = enumValues[randomIndex];
  return anEnum[randomEnumKey];
};
export const getRandomEnumValues = <T extends object>(
  anEnum: T,
): T[keyof T][] => {
  const enumValues = Object.values(anEnum);
  return faker.helpers.arrayElements(enumValues) as T[keyof T][];
};

export const createTenant = async (tenantService: TenantService) => {
  const dto = new SetupTenantRequestDto();
  dto.siteName = faker.string.sample();
  dto.password = '12345678';
  await tenantService.create(dto);
};

export const createProject = async (projectService: ProjectService) => {
  return await projectService.create({
    name: faker.lorem.words(),
    description: faker.lorem.lines(1),
    timezone: {
      countryCode: 'KR',
      name: 'Asia/Seoul',
      offset: '+09:00',
    },
  });
};

export const createChannel = async (
  channelService: ChannelService,
  project: ProjectEntity,
) => {
  return await channelService.create({
    projectId: project.id,
    name: faker.string.alphanumeric(20),
    description: faker.lorem.lines(1),
    feedbackSearchMaxDays: 1000,
    fields: Array.from({
      length: faker.number.int({ min: 1, max: 10 }),
    }).map(() =>
      createFieldDto({
        format: FieldFormatEnum.keyword,
        property: FieldPropertyEnum.EDITABLE,
        status: FieldStatusEnum.ACTIVE,
      }),
    ),
    imageConfig: null,
  });
};

export const createFeedback = async (
  fields: FieldEntity[],
  channelId: number,
  feedbackService: FeedbackService,
) => {
  const dto: CreateFeedbackDto = {
    channelId: channelId,
    data: {},
  };
  fields
    .filter(
      ({ key }) =>
        key !== 'id' &&
        key !== 'issues' &&
        key !== 'createdAt' &&
        key !== 'updatedAt',
    )
    .forEach(({ key, format, options }) => {
      dto.data[key] = getRandomValue(format, options);
    });

  await feedbackService.create(dto);
};

export const clearAllEntities = async (module: TestingModule) => {
  const userRepo: Repository<UserEntity> = module.get(
    getRepositoryToken(UserEntity),
  );
  const roleRepo: Repository<RoleEntity> = module.get(
    getRepositoryToken(RoleEntity),
  );
  const tenantRepo: Repository<TenantEntity> = module.get(
    getRepositoryToken(TenantEntity),
  );
  const projectRepo: Repository<ProjectEntity> = module.get(
    getRepositoryToken(ProjectEntity),
  );
  const channelRepo: Repository<ChannelEntity> = module.get(
    getRepositoryToken(ChannelEntity),
  );
  const fieldRepo: Repository<FieldEntity> = module.get(
    getRepositoryToken(FieldEntity),
  );
  const feedbackRepo: Repository<FeedbackEntity> = module.get(
    getRepositoryToken(FeedbackEntity),
  );

  await clearEntities([
    userRepo,
    roleRepo,
    tenantRepo,
    projectRepo,
    channelRepo,
    fieldRepo,
    feedbackRepo,
  ]);
};

export const clearEntities = async (repos: Repository<any>[]) => {
  for (const repo of repos) {
    await repo.query('set foreign_key_checks = 0');
    await repo.clear();
    await repo.query('set foreign_key_checks = 1');
  }
};

export const signInTestUser = async (
  dataSource: DataSource,
  authService: AuthService,
) => {
  const userRepo = dataSource.getRepository(UserEntity);
  const user = await userRepo.save({
    email: faker.internet.email(),
    state: UserStateEnum.Active,
    hashPassword: faker.internet.password(),
    type: UserTypeEnum.SUPER,
  });
  return { jwt: await authService.signIn(UserDto.transform(user)), user };
};

export const DEFAULT_FIELD_COUNT = 2;

export const createQueryBuilder: Record<string, object> = {
  setFindOptions: () => createQueryBuilder,
  select: () => createQueryBuilder,
  innerJoin: () => createQueryBuilder,
  leftJoin: () => createQueryBuilder,
  leftJoinAndSelect: () => createQueryBuilder,
  where: () => createQueryBuilder,
  andWhere: () => createQueryBuilder,
  groupBy: () => createQueryBuilder,
  addOrderBy: () => createQueryBuilder,
  getRawMany: () => createQueryBuilder,
  insert: () => createQueryBuilder,
  values: () => createQueryBuilder,
  orUpdate: () => createQueryBuilder,
  updateEntity: () => createQueryBuilder,
  execute: () => createQueryBuilder,
  offset: () => createQueryBuilder,
  limit: () => createQueryBuilder,
  getMany: () => createQueryBuilder,
  getCount: () => createQueryBuilder,
  clone: () => createQueryBuilder,
};

export const mockRepository = () => ({
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  findBy: jest.fn(),
  findAndCount: jest.fn(),
  findAndCountBy: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  upsert: jest.fn(),
  count: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(() => createQueryBuilder),
  query: jest.fn(),
  manager: {
    transaction: () => jest.fn().mockImplementation(mockRepository),
  },
});

export const MockOpensearchRepository = {
  createIndex: jest.fn(),
  deleteIndex: jest.fn(),
  putMappings: jest.fn(),
  createData: jest.fn(),
  getData: jest.fn().mockResolvedValue({ items: [], total: 0 }),
  updateData: jest.fn(),
  getTotal: jest.fn(),
  deleteBulkData: jest.fn(),
  scroll: jest.fn().mockResolvedValue({ items: [], total: 0 }),
};

export function removeUndefinedValues<T extends object>(obj: T): T {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === 'object') {
      removeUndefinedValues(obj[key] as object);
    } else if (obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj;
}
