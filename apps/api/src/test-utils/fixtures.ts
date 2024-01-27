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
import * as bcrypt from 'bcrypt';

import {
  FieldFormatEnum,
  FieldStatusEnum,
  FieldTypeEnum,
  isSelectFieldFormat,
} from '@/common/enums';
import type { ChannelEntity } from '@/domains/admin/channel/channel/channel.entity';
import type {
  CreateFieldDto,
  ReplaceFieldDto,
} from '@/domains/admin/channel/field/dtos';
import type { FieldEntity } from '@/domains/admin/channel/field/field.entity';
import type { FeedbackEntity } from '@/domains/admin/feedback/feedback.entity';
import type { CreateIssueDto } from '@/domains/admin/project/issue/dtos';
import type { TenantEntity } from '@/domains/admin/tenant/tenant.entity';
import {
  SignUpMethodEnum,
  UserStateEnum,
  UserTypeEnum,
} from '@/domains/admin/user/entities/enums';
import type { UserEntity } from '@/domains/admin/user/entities/user.entity';

export const createFieldEntity = (input: Partial<CreateFieldDto>) => {
  const format = input?.format ?? getRandomEnumValue(FieldFormatEnum);
  const type = input?.type ?? getRandomEnumValue(FieldTypeEnum);
  const status = input?.status ?? getRandomEnumValue(FieldStatusEnum);
  return {
    name: faker.string.alphanumeric(20),
    description: faker.lorem.lines(2),
    format,
    type,
    status,
    options:
      format === FieldFormatEnum.select
        ? getRandomOptionEntities().sort(optionSort)
        : undefined,
    ...input,
  };
};
export const createFieldDto = (input: Partial<CreateFieldDto>) => {
  const format = input?.format ?? getRandomEnumValue(FieldFormatEnum);
  const type = input?.type ?? getRandomEnumValue(FieldTypeEnum);
  const status = input?.status ?? getRandomEnumValue(FieldStatusEnum);
  return {
    name: faker.string.alphanumeric(20),
    key: faker.string.alphanumeric(20),
    description: faker.lorem.lines(2),
    format,
    type,
    status,
    options: isSelectFieldFormat(format)
      ? getRandomOptionDtos().sort(optionSort)
      : undefined,
    ...input,
  };
};
export const updateFieldDto = (input: Partial<ReplaceFieldDto>) => {
  return {
    id: faker.number.int(),
    ...createFieldDto(input),
  };
};

export const createIssueDto = (input: Partial<CreateIssueDto>) => {
  return {
    name: faker.string.alphanumeric(20),
    ...input,
  };
};

export const getRandomValue = (
  format: FieldFormatEnum,
  options?: { id: number; name: string; key: string }[],
) => {
  switch (format) {
    case FieldFormatEnum.text:
      return faker.string.sample();
    case FieldFormatEnum.keyword:
      return faker.string.sample();
    case FieldFormatEnum.number:
      return faker.number.int();
    case FieldFormatEnum.boolean:
      return faker.datatype.boolean();
    case FieldFormatEnum.select:
      return options.length === 0
        ? undefined
        : options[faker.number.int({ min: 0, max: options.length - 1 })].key;
    case FieldFormatEnum.multiSelect:
      return options.length === 0
        ? []
        : faker.helpers
            .shuffle(options)
            .slice(0, faker.number.int({ min: 0, max: options.length - 1 }))
            .map((option) => option.key);
    case FieldFormatEnum.date:
      return faker.date.anytime().toISOString();
    case FieldFormatEnum.image:
      return faker.string.sample();
    default:
      throw new Error('Invalid field type ');
  }
};

const getRandomOptionEntities = () => {
  const length = faker.number.int(10);
  return Array.from({ length }).map(() => ({
    id: faker.number.int(),
    name: faker.string.sample(),
  }));
};
const getRandomOptionDtos = () => {
  const length = faker.number.int(10);
  return Array.from({ length }).map(() => {
    const randomValue = faker.string.sample();
    return {
      id: faker.number.int(),
      name: randomValue,
      key: randomValue,
    };
  });
};

export const getRandomEnumValue = <T>(anEnum: T): T[keyof T] => {
  const enumValues = Object.keys(anEnum) as Array<keyof T>;
  const randomIndex = faker.number.int(enumValues.length - 1);
  const randomEnumKey = enumValues[randomIndex];
  return anEnum[randomEnumKey];
};
export const getRandomEnumValues = <T>(anEnum: T): T[keyof T][] => {
  const enumValues = Object.values(anEnum) as Array<keyof T>;
  return faker.helpers.arrayElements(enumValues) as T[keyof T][];
};

export const optionSort = (a, b) =>
  a.name < b.name ? -1 : a.name > b.name ? 1 : 0;

export const fieldsFixture = Object.values(FieldFormatEnum).flatMap((format) =>
  Object.values(FieldTypeEnum).flatMap((type) =>
    Object.values(FieldStatusEnum).flatMap((status) => ({
      id: faker.number.int(),
      ...createFieldDto({
        format,
        type,
        status,
      }),
    })),
  ),
) as FieldEntity[];

export const feedbackDataFixture = fieldsFixture.reduce((prev, curr) => {
  if (curr.type === FieldTypeEnum.ADMIN) return prev;
  if (curr.status === FieldStatusEnum.INACTIVE) return prev;
  const value = getRandomValue(curr.format, curr.options);
  return {
    ...prev,
    [curr.key]: value,
  };
}, {});

export const feedbackFixture = {
  id: faker.number.int(),
  rawData: feedbackDataFixture,
  additionalData: {},
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
  channel: {
    id: faker.number.int(),
    name: faker.string.sample(),
    description: faker.lorem.lines(2),
    imageConfig: null,
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  } as ChannelEntity,
  issues: [],
} as FeedbackEntity;

export const passwordFixture = faker.internet.password();

export const emailFixture = faker.internet.email();

export const userFixture = {
  id: faker.number.int(),
  email: emailFixture,
  name: faker.string.sample(),
  department: faker.string.sample(),
  state: getRandomEnumValue(UserStateEnum),
  hashPassword: bcrypt.hashSync(passwordFixture, 0),
  type: getRandomEnumValue(UserTypeEnum),
  signUpMethod: getRandomEnumValue(SignUpMethodEnum),
} as UserEntity;

export const tenantFixture = {
  id: faker.number.int(),
  siteName: faker.string.sample(),
  description: faker.lorem.lines(2),
  useEmail: faker.datatype.boolean(),
  isPrivate: faker.datatype.boolean(),
  isRestrictDomain: faker.datatype.boolean(),
  allowDomains: [],
  useOAuth: faker.datatype.boolean(),
  oauthConfig: null,
  createdAt: faker.date.past(),
  updatedAt: faker.date.past(),
} as TenantEntity;
