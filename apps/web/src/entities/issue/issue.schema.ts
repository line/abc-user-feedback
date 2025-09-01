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

import { categorySchema } from '../category/category.schema';

export const issueSchema = z.object({
  id: z.number(),
  name: z.string().trim().min(1).max(30),
  description: z.string().trim().max(50).nullable(),
  feedbackCount: z.number(),
  status: z.union([
    z.literal('INIT'),
    z.literal('ON_REVIEW'),
    z.literal('IN_PROGRESS'),
    z.literal('RESOLVED'),
    z.literal('PENDING'),
  ]),
  externalIssueId: z.string().trim().optional(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  category: categorySchema.nullable(),
});

export const issueFormSchema = issueSchema.pick({
  name: true,
  description: true,
  status: true,
  externalIssueId: true,
});
