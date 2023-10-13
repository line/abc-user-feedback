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

import {
  FieldFormatEnum,
  FieldStatusEnum,
  FieldTypeEnum,
  isSelectFieldFormat,
} from '@/common/enums';
import type { ReplaceFieldDto } from '@/domains/channel/field/dtos';
import type { CreateFieldDto } from '@/domains/channel/field/dtos/create-field.dto';
import type { CreateIssueDto } from '@/domains/project/issue/dtos';

export const createFieldEntity = (input: Partial<CreateFieldDto>) => {
  const format = input?.format ?? getRandomEnumValue(FieldFormatEnum);
  const type = input?.type ?? getRandomEnumValue(FieldTypeEnum);
  const status = input?.status ?? getRandomEnumValue(FieldStatusEnum);
  return {
    name: faker.random.alphaNumeric(20),
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
    name: faker.random.alphaNumeric(20),
    key: faker.random.alphaNumeric(20),
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
    id: faker.datatype.number(),
    ...createFieldDto(input),
  };
};

export const createIssueDto = (input: Partial<CreateIssueDto>) => {
  return {
    name: faker.random.alphaNumeric(20),
    ...input,
  };
};

export const getRandomValue = (
  format: FieldFormatEnum,
  options?: { id: number; name: string; key: string }[],
) => {
  switch (format) {
    case FieldFormatEnum.text:
      return faker.datatype.string();
    case FieldFormatEnum.keyword:
      return faker.datatype.string();
    case FieldFormatEnum.number:
      return faker.datatype.number();
    case FieldFormatEnum.boolean:
      return faker.datatype.boolean();
    case FieldFormatEnum.select:
      return options.length === 0
        ? undefined
        : options[faker.datatype.number({ min: 0, max: options.length - 1 })]
            .key;
    case FieldFormatEnum.multiSelect:
      return options.length === 0
        ? []
        : faker.helpers
            .shuffle(options)
            .slice(
              0,
              faker.datatype.number({ min: 0, max: options.length - 1 }),
            )
            .map((option) => option.key);
    case FieldFormatEnum.date:
      return faker.datatype.datetime().toISOString();
    default:
      throw new Error('Invalid field type ');
  }
};

const getRandomOptionEntities = () => {
  const length = faker.datatype.number(10);
  return Array.from({ length }).map(() => ({
    id: faker.datatype.number(),
    name: faker.datatype.string(),
  }));
};
const getRandomOptionDtos = () => {
  const length = faker.datatype.number(10);
  return Array.from({ length }).map(() => {
    const randomValue = faker.datatype.string();
    return {
      id: faker.datatype.number(),
      name: randomValue,
      key: randomValue,
    };
  });
};

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

export const optionSort = (a, b) =>
  a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
