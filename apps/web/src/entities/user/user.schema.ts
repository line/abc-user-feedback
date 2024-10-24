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

import { z } from 'zod';

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  type: z.union([z.literal('SUPER'), z.literal('GENERAL')]),
  name: z.string().nullable(),
  department: z.string().nullable(),
  signUpMethod: z.union([z.literal('OAUTH'), z.literal('EMAIL')]),
});

export const memberSchema = z.object({
  id: z.number(),
  role: z.object({
    name: z.string(),
    project: z.object({
      id: z.number(),
      name: z.string(),
    }),
  }),
});

export const userMemberSchema = userSchema.merge(
  z.object({
    members: z.array(memberSchema),
    createdAt: z.string(),
  }),
);

export const updateUserSchema = userSchema.omit({
  id: true,
  signUpMethod: true,
});
