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

import { FieldTypeEnum } from '@/domains/feedback/services/dtos';
import { CreateFieldDto } from '@/domains/feedback/services/dtos/fields/create-field.dto';

export const createFieldEntity = (input: Partial<CreateFieldDto>) => {
  const type = input?.type ?? getRandomEnumValue(FieldTypeEnum);
  return {
    name: faker.random.alphaNumeric(20),
    description: faker.lorem.lines(2),
    type,
    isAdmin: false,
    isDisabled: false,
    order: 0,
    options:
      type === FieldTypeEnum.select
        ? getRandomOptionEntities().sort(optionSort)
        : undefined,
    ...input,
  };
};
export const createFieldDto = (input: Partial<CreateFieldDto>) => {
  const type = input?.type ?? getRandomEnumValue(FieldTypeEnum);
  return {
    name: faker.random.alphaNumeric(20),
    description: faker.lorem.lines(2),
    type,
    isAdmin: false,
    isDisabled: false,
    order: 0,
    options:
      type === FieldTypeEnum.select
        ? getRandomOptionDtos().sort(optionSort)
        : undefined,
    ...input,
  };
};

export const getRandomValue = (
  type: FieldTypeEnum,
  options?: { id: string; name: string }[],
) => {
  switch (type) {
    case FieldTypeEnum.boolean:
      return faker.datatype.boolean();
    case FieldTypeEnum.date:
      return faker.datatype.datetime().toISOString();
    case FieldTypeEnum.number:
      return faker.datatype.number();
    case FieldTypeEnum.select:
      return options.length === 0
        ? undefined
        : options[faker.datatype.number({ min: 0, max: options.length - 1 })]
            .name;
    case FieldTypeEnum.text:
      return faker.datatype.string();
    case FieldTypeEnum.keyword:
      return faker.datatype.string();
    default:
      throw new Error('Invalid field type ');
  }
};

const getRandomOptionEntities = () => {
  const length = faker.datatype.number(10);
  return Array.from({ length }).map(() => ({
    id: faker.datatype.uuid(),
    name: faker.datatype.string(),
  }));
};
const getRandomOptionDtos = () => {
  const length = faker.datatype.number(10);
  return Array.from({ length }).map(() => ({
    name: faker.datatype.string(),
  }));
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
