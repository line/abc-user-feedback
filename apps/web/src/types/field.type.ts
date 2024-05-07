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

export const PrimitiveFieldFormatEnumList = [
  'text',
  'keyword',
  'number',
  'date',
] as const;

export const FieldFormatEnumList = [
  ...PrimitiveFieldFormatEnumList,
  'select',
  'multiSelect',
  'images',
] as const;

export type PrimitiveFieldFormatEnumType =
  (typeof PrimitiveFieldFormatEnumList)[number];
export type FieldFormatEnumType = (typeof FieldFormatEnumList)[number];

export const FieldPropertyEnumList = ['READ_ONLY', 'EDITABLE'] as const;
export type FieldPropertyEnumType = (typeof FieldPropertyEnumList)[number];

export const FieldStatusEnumList = ['ACTIVE', 'INACTIVE'] as const;
export type FieldStatusEnumType = (typeof FieldStatusEnumList)[number];

export type FieldType = {
  id: number;
  key: string;
  name: string;
  description: string | null;
  format: FieldFormatEnumType;
  property: FieldPropertyEnumType;
  status: FieldStatusEnumType;
  options?: OptionType[];
  createdAt: string;
  updatedAt: string;
};

export type OptionType = {
  id?: number;
  name: string;
  key: string;
};

export type InputFieldType = Omit<FieldType, 'id' | 'createdAt' | 'updatedAt'>;
