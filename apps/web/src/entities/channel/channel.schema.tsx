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

export const channelImageConfigSchema = z.object({
  accessKeyId: z.string().trim(),
  secretAccessKey: z.string().trim(),
  endpoint: z.string().trim(),
  region: z.string().trim(),
  bucket: z.string().trim(),
  domainWhiteList: z.array(z.string().trim()).nullable(),
  enablePresignedUrlDownload: z.boolean().optional(),
});

export const channelSchema = z.object({
  id: z.number(),
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
  createdAt: z.string(),
  updatedAt: z.string(),
  imageConfig: channelImageConfigSchema.nullable().optional(),
  feedbackSearchMaxDays: z.number(),
});

export const channelInfoSchema = channelSchema
  .pick({ name: true, description: true, feedbackSearchMaxDays: true })
  .merge(z.object({ id: z.number().optional() }));
