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

import { i18n } from 'next-i18next';
import { z } from 'zod';

import { FIELD_FORMAT_LIST } from './field.constant';

export const fieldOptionSchema = z.object({
  id: z.number(),
  key: z
    .string()
    .trim()
    .min(1, { message: i18n?.t('hint.required') })
    .max(20, { message: i18n?.t('hint.max-length', { length: 20 }) }),
  name: z
    .string()
    .trim()
    .min(1, { message: i18n?.t('hint.required') })
    .max(20, { message: i18n?.t('hint.max-length', { length: 20 }) }),
});

export const fieldSchema = z.object({
  id: z.number(),
  key: z
    .string()
    .trim()
    .min(1, { message: i18n?.t('hint.required') })
    .max(20, { message: i18n?.t('hint.max-length', { length: 20 }) })
    .regex(
      /^[A-Za-z0-9_]*$/,
      'String can only contain letters, numbers, and underscores, with no spaces or other special characters.',
    ),
  name: z
    .string()
    .trim()
    .min(1, { message: i18n?.t('hint.required') })
    .max(20, { message: i18n?.t('hint.max-length', { length: 20 }) }),
  description: z
    .string()
    .trim()
    .max(50, { message: i18n?.t('hint.max-length', { length: 50 }) })
    .nullable(),
  format: z.enum(FIELD_FORMAT_LIST),
  property: z.enum(['READ_ONLY', 'EDITABLE']),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  options: z.array(fieldOptionSchema).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  order: z.number(),
  aiFieldTemplateId: z.number().nullable().optional(),
  aiFieldTargetKeys: z.array(z.string()).nullable().optional(),
  aiFieldAutoProcessing: z.boolean().nullable().optional(),
});

export const fieldInfoSchema = fieldSchema
  .pick({
    key: true,
    name: true,
    description: true,
    format: true,
    property: true,
    status: true,
    options: true,
    order: true,
    aiFieldTemplateId: true,
    aiFieldTargetKeys: true,
    aiFieldAutoProcessing: true,
  })
  .merge(
    z.object({
      id: z.number().optional(),
      createdAt: z.string().optional(),
      options: z
        .array(
          fieldOptionSchema
            .pick({ key: true, name: true })
            .merge(z.object({ id: z.number().optional() })),
        )
        .optional(),
    }),
  )
  .refine(
    (data) =>
      data.format === 'select' || data.format === 'multiSelect' ?
        !!data.options && data.options.length > 0
      : true,
    {
      path: ['options'],
      message: 'Option is required.',
    },
  )
  .refine(
    (data) => (data.format === 'aiField' ? !!data.aiFieldTemplateId : true),
    {
      path: ['aiFieldTemplateId'],
      message: 'Template is required.',
    },
  )
  .refine(
    (data) =>
      data.format === 'aiField' ?
        !!data.aiFieldTargetKeys && data.aiFieldTargetKeys.length > 0
      : true,
    {
      path: ['aiFieldTargetKeys'],
      message: 'Target Fields are required.',
    },
  );
