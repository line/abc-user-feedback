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

export const projectSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .trim()
    .min(1, { message: i18n?.t('v2.error.required') })
    .max(20, { message: i18n?.t('v2.error.lessThenNcharacters', { n: 20 }) }),
  description: z
    .string()
    .trim()
    .max(50, { message: i18n?.t('v2.error.lessThenNcharacters', { n: 50 }) })
    .nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  timezone: z.object({
    countryCode: z.string(),
    name: z.string(),
    offset: z.string(),
  }),
});

export const projectInfoSchema = projectSchema
  .pick({
    name: true,
    description: true,
    timezone: true,
  })
  .merge(z.object({ id: z.number().optional() }));
