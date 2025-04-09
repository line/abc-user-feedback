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

import type { z } from 'zod';

import type {
  fieldInfoSchema,
  fieldOptionSchema,
  fieldSchema,
} from './field.schema';

export type Field = z.infer<typeof fieldSchema>;
export type FieldInfo = z.infer<typeof fieldInfoSchema>;
export type FieldFormat = Field['format'];
export type FieldProperty = Field['property'];
export type FieldStatus = Field['status'];
export type FieldOption = z.infer<typeof fieldOptionSchema>;

export type FieldOptionInfo = Omit<FieldOption, 'id'> & {
  id?: number;
};
