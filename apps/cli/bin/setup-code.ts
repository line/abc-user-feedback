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
import crypto from 'crypto';

/**
 * Same derivation as getTenantSetupCode in
 * apps/api/src/domains/admin/tenant/tenant-setup-code.ts.
 */
export function getTenantSetupCode(jwtSecret: string): string {
  const digest = crypto
    .createHmac('sha256', jwtSecret)
    .update('abc-user-feedback:tenant-setup')
    .digest('hex')
    .slice(0, 12)
    .toUpperCase();
  return digest.match(/.{4}/g)?.join('-') ?? digest;
}
