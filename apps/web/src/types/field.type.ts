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
export const FormulaFieldTypeEnumList = ['text', 'boolean', 'number'] as const;

export type FormulaFieldEnumType = (typeof FormulaFieldTypeEnumList)[number];

export const FieldTypeEnumList = [
  'text',
  'keyword',
  'boolean',
  'number',
  'select',
  'date',
] as const;

export type FieldTypeEnumType = (typeof FieldTypeEnumList)[number];

export type FieldType = {
  id: string;
  type: FieldTypeEnumType;
  name: string;
  description: string;
  isAdmin: boolean;
  isDisabled: boolean;
  order: number;
  options?: { id?: string; name: string }[];
};
