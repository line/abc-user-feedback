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

import type { z } from 'zod';

import type { fieldInfoSchema, fieldSchema } from './field.schema';

export type Field = z.infer<typeof fieldSchema>;
export type FieldInfo = z.infer<typeof fieldInfoSchema>;
export type FieldFormat = Field['format'];
export type FieldProperty = Field['property'];
export type FieldStatus = Field['status'];
export type FieldOption = Field['options'][number];

export type FieldOptionInfo = Omit<FieldOption, 'id'> & {
  id?: number;
};
