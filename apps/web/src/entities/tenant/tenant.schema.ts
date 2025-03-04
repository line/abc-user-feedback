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

const oauthInputConfigSchema = z.object({
  clientId: z.string().trim(),
  clientSecret: z.string().trim(),
  authCodeRequestURL: z.string().trim(),
  scopeString: z.string().trim(),
  accessTokenRequestURL: z.string().trim(),
  userProfileRequestURL: z.string().trim(),
  emailKey: z.string().trim(),
});

const oauthInputRequiredConfigSchema = oauthInputConfigSchema.extend({
  clientId: z.string().trim().min(1),
  clientSecret: z.string().trim().min(1),
  authCodeRequestURL: z.string().trim().min(1),
  scopeString: z.string().trim().min(1),
  accessTokenRequestURL: z.string().trim().min(1),
  userProfileRequestURL: z.string().trim().min(1),
  emailKey: z.string().trim().min(1),
});

const oauthConfigSchema = oauthInputConfigSchema
  .extend({
    loginButtonType: z.literal('CUSTOM'),
    loginButtonName: z.string().trim().min(1),
  })
  .or(
    oauthInputConfigSchema.extend({
      loginButtonType: z.literal('GOOGLE').nullable(),
      loginButtonName: z.string().trim().nullable(),
    }),
  );

export const tenantSchema = z.object({
  id: z.number(),
  siteName: z.string().trim().min(1).max(20),
  description: z.string().trim().max(50).nullable(),
  useEmail: z.boolean(),
  useOAuth: z.boolean(),
  allowDomains: z
    .array(
      z
        .string()
        .trim()
        .refine((v) => /[a-z]+\.[a-z]{2,3}/.test(v)),
    )
    .nullable(),
  oauthConfig: oauthConfigSchema.nullable(),
});

export const tenantInfoSchema = tenantSchema.pick({
  id: true,
  siteName: true,
  description: true,
});

export const authInfoScema = tenantSchema
  .pick({
    useEmail: true,
    allowDomains: true,
    useOAuth: true,
    oauthConfig: true,
  })
  .refine((schema) =>
    schema.useOAuth ?
      z.object({ oauthConfig: oauthInputRequiredConfigSchema }).parse(schema)
    : true,
  );
