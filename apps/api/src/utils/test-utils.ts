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
import {
  ElasticsearchModule,
  ElasticsearchModuleOptions,
} from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource, Repository } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';

import {
  elasticsearchConfig,
  elasticsearchSchema,
} from '@/configs/elasticsearch.config';
import { jwtConfig, jwtConfigSchema } from '@/configs/jwt.config';
import { mySqlConfigSchema, mysqlConfig } from '@/configs/mysql.config';
import { smtpConfig, smtpConfigSchema } from '@/configs/smtp.config';
import { AuthService } from '@/domains/auth/auth.service';
import {
  OWNER_ROLE,
  OWNER_ROLE_DEFAULT_ID,
} from '@/domains/role/role.constant';
import { RoleEntity } from '@/domains/role/role.entity';
import { UserDto } from '@/domains/user/dtos';
import { UserStateEnum } from '@/domains/user/entities/enums';
import { UserEntity } from '@/domains/user/entities/user.entity';

initializeTransactionalContext();

export const getMockProvider = (
  injectToken: InjectionToken,
  factory: unknown,
): Provider => ({ provide: injectToken, useFactory: () => factory });

export const TestConfig = ConfigModule.forRoot({
  load: [elasticsearchConfig, smtpConfig, jwtConfig, mysqlConfig],
  envFilePath: '.env.test',
  validate: (config) => ({
    ...elasticsearchSchema.validateSync(config),
    ...smtpConfigSchema.validateSync(config),
    ...jwtConfigSchema.validateSync(config),
    ...mySqlConfigSchema.validateSync(config),
  }),
});

export const TestMailConfigModule = MailerModule.forRoot({
  transport: { url: '' },
});
export const TestElasticsearchConfigModule = ElasticsearchModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): ElasticsearchModuleOptions => {
    const { node, password, username } = configService.get('elasticsearch');
    return { node, auth: { username, password } };
  },
});

export const TestTypeOrmConfig = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  dataSourceFactory: async (options) => {
    const datasource = await new DataSource(options).initialize();
    return addTransactionalDataSource(datasource);
  },
  useFactory: (configService: ConfigService) => {
    return {
      type: 'mysql',
      url: configService.get('mysql.url'),
      replication: {
        master: { url: configService.get('mysql.main_url') },
        slaves: [{ url: configService.get('mysql.sub_url') }],
      },
      entities: [join(__dirname, '../**/*.entity.{ts,js}')],
      namingStrategy: new SnakeNamingStrategy(),
    };
  },
});

export const TestConfigs = [
  TestConfig,
  TestMailConfigModule,
  TestTypeOrmConfig,
  TestElasticsearchConfigModule,
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
  const roleRepo = dataSource.getRepository(RoleEntity);
  if (!(await roleRepo.findOneBy({ id: OWNER_ROLE_DEFAULT_ID }))) {
    await roleRepo.save(OWNER_ROLE);
  }

  const userRepo = dataSource.getRepository(UserEntity);
  const user = await userRepo.save({
    email: faker.internet.email(),
    state: UserStateEnum.Active,
    hashPassword: faker.internet.password(),
    role: OWNER_ROLE,
  });
  return { jwt: await authService.signIn(UserDto.transform(user)), user };
};

export const DEFAULT_FIELD_COUNT = 2;
