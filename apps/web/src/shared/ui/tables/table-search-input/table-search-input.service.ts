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
import dayjs from 'dayjs';

import type { SearchItemType } from '@/shared';
import { DATE_FORMAT, isDateQuery } from '@/shared';

export const strToObj = (input: string, searchItems: SearchItemType[]) => {
  const splitValues = input.split(',');
  const mergedValues: string[] = [];
  for (const splitValue of splitValues) {
    if (splitValue.includes(':')) mergedValues.push(splitValue);
  }

  const result: Record<string, unknown> = {};

  for (const mergedValue of mergedValues) {
    const [name, value] = mergedValue.split(':').map((v) => v.trim());
    if (!name || !value) continue;

    const column = searchItems.find((column) => column.name === name);

    if (!column) {
      result[name] = value;
    } else {
      result[column.key] = strValueToObj(value, column);
    }
  }

  return result;
};

export const strValueToObj = (value: string, searchItems: SearchItemType) => {
  switch (searchItems.format) {
    case 'date': {
      const [gte, lt] = value
        .split('~')
        .map((v) => dayjs(v, { format: DATE_FORMAT }).toDate());
      return { gte, lt };
    }
    case 'issue':
    case 'select':
    case 'multiSelect':
      return searchItems.options?.find((v) => v.name === value) ?? value;
    default:
      return value;
  }
};

export const objToStr = (
  query: Record<string, unknown>,
  searchItems: SearchItemType[],
) => {
  return Object.entries(query)
    .map(([key, value]) => {
      const column = searchItems.find((column) => column.key === key);

      if (!column) return;
      const { name } = column;

      switch (column.format) {
        case 'date':
          if (typeof value === 'string') {
            return `${name}:${value}`;
          } else if (isDateQuery(value)) {
            return `${name}:${dayjs(value.gte).format(DATE_FORMAT)}~${dayjs(
              value.lt,
            ).format(DATE_FORMAT)}`;
          } else {
            return '';
          }
        case 'issue':
          if (Array.isArray(value)) {
            const issueName = column.options?.find(
              (v) => v.id === value[0],
            )?.name;
            return `${name}:${issueName}`;
          } else if (hasNameOfKey(value)) {
            return `${name}:${value.name}`;
          } else if (typeof value === 'string') {
            const issueName = column.options?.find(
              (v) => v.id === parseInt(String(value)),
            )?.name;
            return `${name}:${issueName}`;
          }
          return `${name}:${String(value)}`;
        case 'select':
        case 'multiSelect':
          if (hasNameOfKey(value)) {
            return `${name}:${value.name}`;
          }
          return `${name}:${String(value)}`;
        default:
          return `${name}:${String(value)}`;
      }
    })
    .filter((v) => !!v)
    .join(',');
};

export const objToQuery = (
  query: Record<string, unknown>,
  searchItems: SearchItemType[],
) => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(query)) {
    const column = searchItems.find((column) => column.key === key);

    if (!column) result[key] = value;
    else {
      try {
        switch (column.format) {
          case 'number':
            result[key] = value;
            break;
          case 'date':
            if (typeof value === 'string') {
              const [gte, lt] = value
                .split('~')
                .map((v) => dayjs(v, { format: DATE_FORMAT }).toDate());
              result[key] = {
                gte: dayjs(gte).startOf('day').toISOString(),
                lt: dayjs(lt).endOf('day').toISOString(),
              };
            } else if (isDateQuery(value)) {
              result[key] = {
                gte: dayjs(value.gte).startOf('day').toISOString(),
                lt: dayjs(value.lt).endOf('day').toISOString(),
              };
            }
            break;
          case 'issue': {
            const issueId =
              hasIdOfKey(value) ?
                value.id
              : column.options?.find((v) => v.name === value)?.id;
            result[key] = [issueId];
            break;
          }
          case 'multiSelect': {
            const optionKey1 =
              hasKeyOfKey(value) ?
                value.key
              : column.options?.find((v) => v.name === value)?.key;
            if (!optionKey1) break;
            result[key] = [optionKey1];
            break;
          }
          case 'select': {
            const optionKey2 =
              hasKeyOfKey(value) ?
                value.key
              : column.options?.find((v) => v.name === value)?.key;

            if (!optionKey2) break;
            result[key] = optionKey2;
            break;
          }
          default:
            result[key] = value;
            break;
        }
      } catch {
        result[key] = undefined;
      }
    }
  }
  return result;
};

const hasNameOfKey = (value: unknown): value is { name: string } => {
  return (
    typeof value === 'object' &&
    !!value &&
    'name' in value &&
    typeof value.name === 'string'
  );
};

const hasIdOfKey = (value: unknown): value is { id: number } => {
  return (
    typeof value === 'object' &&
    !!value &&
    'id' in value &&
    typeof value.id === 'number'
  );
};
const hasKeyOfKey = (value: unknown): value is { key: string } => {
  return (
    typeof value === 'object' &&
    !!value &&
    'key' in value &&
    typeof value.key === 'string'
  );
};
