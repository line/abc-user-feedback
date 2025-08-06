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
import { FieldFormatEnum, SortMethodEnum } from '@/common/enums';
import type { FieldEntity } from '../channel/field/field.entity';

export function isInvalidSortMethod(method: SortMethodEnum) {
  return ![SortMethodEnum.ASC, SortMethodEnum.DESC].includes(method);
}

export function validateValue(field: FieldEntity, value: any) {
  switch (field.format) {
    case FieldFormatEnum.number:
      return typeof value === 'number';
    case FieldFormatEnum.text:
    case FieldFormatEnum.aiField:
      return typeof value === 'string';
    case FieldFormatEnum.keyword:
      return typeof value === 'string';
    case FieldFormatEnum.select:
      return (
        value === null ||
        (typeof value === 'string' &&
          !!(field.options ?? []).find((v) => v.key === value))
      );
    case FieldFormatEnum.multiSelect:
      if (Array.isArray(value)) {
        for (const option of value) {
          if (!(field.options ?? []).find((v) => v.key === option))
            return false;
        }
        return true;
      } else {
        return false;
      }
    case FieldFormatEnum.date:
      return (
        value === null ||
        (!isNaN(Date.parse(value as string)) && typeof value !== 'number')
      );
    case FieldFormatEnum.images:
      return Array.isArray(value);
    default:
      throw new Error(
        `${field.key}: ${field.format as string} is error ${value}`,
      );
  }
}
