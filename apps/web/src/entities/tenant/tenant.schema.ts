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

export const tenantSchema = z.object({
  id: z.number(),
  siteName: z.string(),
  description: z.string().nullable(),
  useEmail: z.boolean(),
  useOAuth: z.boolean(),
  isPrivate: z.boolean(),
  isRestrictDomain: z.boolean(),
  allowDomains: z
    .array(z.string().refine((v) => /[a-z]+\.[a-z]{2,3}/.test(v)))
    .nullable(),
  useEmailVerification: z.boolean(),
  oauthConfig: z
    .object({
      clientId: z.string(),
      emailKey: z.string(),
      scopeString: z.string(),
      clientSecret: z.string(),
      authCodeRequestURL: z.string(),
      accessTokenRequestURL: z.string(),
      userProfileRequestURL: z.string(),
    })
    .nullable(),
});

export const tenantInfoSchema = tenantSchema.pick({
  id: true,
  siteName: true,
  description: true,
});
export const authInfoScema = tenantSchema.pick({
  isPrivate: true,
  isRestrictDomain: true,
  allowDomains: true,
  useOAuth: true,
  useEmail: true,
  oauthConfig: true,
});
