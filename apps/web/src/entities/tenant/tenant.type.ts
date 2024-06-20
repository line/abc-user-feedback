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

const oauthConfigSchema = z.object({
  oauthUse: z.boolean(),
  clientId: z.string(),
  clientSecret: z.string(),
  authCodeRequestURL: z.string(),
  scopeString: z.string(),
  accessTokenRequestURL: z.string(),
  userProfileRequestURL: z.string(),
  emailKey: z.string(),
});

const tenantSchema = z.object({
  id: z.number(),
  siteName: z.string(),
  description: z.string().nullable(),
  useEmail: z.boolean(),
  useOAuth: z.boolean(),
  isPrivate: z.boolean(),
  isRestrictDomain: z.boolean(),
  allowDomains: z.array(z.string()),
  useEmailVerification: z.boolean(),
  oauthConfig: oauthConfigSchema.nullable(),
});

export type Tenant = z.infer<typeof tenantSchema>;

export type OAuthConfig = z.infer<typeof oauthConfigSchema>;
