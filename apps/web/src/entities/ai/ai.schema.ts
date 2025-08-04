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

import { z } from 'zod';

export const aiSchema = z.object({
  provider: z.enum(['OPEN_AI', 'GEMINI']),
  apiKey: z.string().trim().min(1, { message: 'API Key is required' }),
  endpointUrl: z.string().trim(),
  systemPrompt: z.string().trim(),
  tokenThreshold: z.number().nullable(),
  notificationThreshold: z.number().nullable(),
});

export const aiTemplateSchema = z.object({
  title: z.string().trim().min(1).max(30),
  prompt: z.string().trim().min(1),
  model: z.string(),
  temperature: z.number(),
});

export const aiIssueSchema = z.object({
  channelId: z.number().int(),
  targetFieldKeys: z.array(z.string()).min(1),
  prompt: z.string().trim(),
  isEnabled: z.boolean(),
  model: z.string(),
  temperature: z.number(),
  dataReferenceAmount: z.number(),
});
