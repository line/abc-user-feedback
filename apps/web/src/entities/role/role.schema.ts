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

import { i18n } from 'next-i18next';
import { z } from 'zod';

import { PermissionList } from './permission.type';

export const roleSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .trim()
    .min(1, { message: i18n?.t('hint.required') })
    .max(20, { message: i18n?.t('hint.max-length', { length: 20 }) }),
  permissions: z.array(z.enum(PermissionList)),
});

// id optional로 변경
export const roleInfoSchema = roleSchema.extend({
  id: z.number().optional(),
});
