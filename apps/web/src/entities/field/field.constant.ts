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

import type { Color, IconNameType } from '@ufb/react';

import type { Field, FieldFormat } from './field.type';

export const FIELD_FORMAT_LIST = [
  'text',
  'keyword',
  'number',
  'date',
  'select',
  'multiSelect',
  'images',
  'aiField',
] as const;

export const FIELD_FORMAT_ICON_MAP: Record<FieldFormat, IconNameType> = {
  text: 'RiText',
  keyword: 'RiFontSize',
  number: 'RiHashtag',
  date: 'RiCalendarEventLine',
  select: 'RiCheckboxCircleLine',
  multiSelect: 'RiListCheck',
  images: 'RiImageLine',
  aiField: 'RiSparklingFill',
};

export const FIELD_STATUS_COLOR_MAP: Record<Field['status'], Color> = {
  ACTIVE: 'green',
  INACTIVE: 'red',
};

export const DEFAULT_FIELD_KEYS = ['id', 'createdAt', 'updatedAt', 'issues'];
