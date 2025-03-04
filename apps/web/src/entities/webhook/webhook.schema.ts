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

import { channelSchema } from '../channel';

export const webhookEventSchema = z.object({
  id: z.number(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  type: z.enum([
    'FEEDBACK_CREATION',
    'ISSUE_CREATION',
    'ISSUE_STATUS_CHANGE',
    'ISSUE_ADDITION',
  ]),
  channels: z.array(channelSchema),
  createdAt: z.string(),
});

export const webhookSchema = z.object({
  id: z.number(),
  name: z.string().trim().min(1).max(20),
  url: z.string().url(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  events: z.array(webhookEventSchema),
  token: z
    .string()
    .min(16)
    .regex(/^[a-zA-Z0-9._-]+$/)
    .or(
      z
        .string()
        .length(0)
        .transform(() => null),
    )
    .or(z.null()),
  createdAt: z.string(),
});

export const webhookInfoSchema = webhookSchema
  .omit({
    id: true,
    createdAt: true,
    events: true,
  })
  .merge(
    z.object({
      events: z.array(
        webhookEventSchema
          .omit({ id: true, createdAt: true, channels: true })
          .merge(z.object({ channelIds: z.array(z.number()) })),
      ),
    }),
  );
