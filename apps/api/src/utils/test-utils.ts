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
import { MailerModule } from '@nestjs-modules/mailer';
import { InjectionToken, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource, Repository } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';

import { jwtConfig, jwtConfigSchema } from '@/configs/jwt.config';
import { mySqlConfigSchema, mysqlConfig } from '@/configs/mysql.config';
import { smtpConfig, smtpConfigSchema } from '@/configs/smtp.config';
import { AuthService } from '@/domains/auth/auth.service';
import { UserDto } from '@/domains/user/dtos';
import { UserStateEnum } from '@/domains/user/entities/enums';
import { UserEntity } from '@/domains/user/entities/user.entity';
import { ConfigServiceType } from '@/types/config-service.type';

initializeTransactionalContext();

export const getMockProvider = (
  injectToken: InjectionToken,
  factory: unknown,
): Provider => ({ provide: injectToken, useFactory: () => factory });

export const TestConfig = ConfigModule.forRoot({
  load: [smtpConfig, jwtConfig, mysqlConfig],
  envFilePath: '.env.test',
  validate: (config) => ({
    ...smtpConfigSchema.validateSync(config),
    ...jwtConfigSchema.validateSync(config),
    ...mySqlConfigSchema.validateSync(config),
  }),
});

export const TestMailConfigModule = MailerModule.forRoot({
  transport: { url: '' },
});

export const TestTypeOrmConfig = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  dataSourceFactory: async (options) => {
    const datasource = await new DataSource(options).initialize();
    return addTransactionalDataSource(datasource);
  },
  useFactory: (configService: ConfigService<ConfigServiceType>) => {
    const { main_url, sub_urls } = configService.get('mysql', {
      infer: true,
    });
    return {
      type: 'mysql',
      replication: {
        master: { url: main_url },
        slaves: sub_urls.map((url) => ({ url })),
      },
      entities: [join(__dirname, '../**/*.entity.{ts,js}')],
      logging: ['warn', 'error'],
      namingStrategy: new SnakeNamingStrategy(),
      timezone: '+00:00',
    };
  },
});

export const TestConfigs = [
  TestConfig,
  TestMailConfigModule,
  TestTypeOrmConfig,
];

export const getRandomEnumValue = <T>(anEnum: T): T[keyof T] => {
  const enumValues = Object.keys(anEnum) as Array<keyof T>;
  const randomIndex = faker.datatype.number(enumValues.length - 1);
  const randomEnumKey = enumValues[randomIndex];
  return anEnum[randomEnumKey];
};
export const getRandomEnumValues = <T>(anEnum: T): T[keyof T][] => {
  const enumValues = Object.values(anEnum) as Array<keyof T>;
  return faker.helpers.arrayElements(enumValues) as T[keyof T][];
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
  });
  return { jwt: await authService.signIn(UserDto.transform(user)), user };
};

export const DEFAULT_FIELD_COUNT = 2;

export const createQueryBuilder: any = {
  setFindOptions: () =>
    jest.fn().mockImplementation(() => {
      return createQueryBuilder;
    }),
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
});

export const MockOpensearchRepository = {
  createIndex: jest.fn(),
  deleteIndex: jest.fn(),
  putMappings: jest.fn(),
  createData: jest.fn(),
  getData: jest.fn(),
  updateData: jest.fn(),
  getTotal: jest.fn(),
};
