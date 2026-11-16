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
 * One-time code that proves the caller of the first-run setup is the
 * operator. It is derived from JWT_SECRET so every API replica agrees on it
 * without shared state, and the operator can read it from the API log (or
 * from `auf-cli start`). Keep in sync with apps/cli/bin/setup-code.ts.
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

export function isValidTenantSetupCode(
  jwtSecret: string,
  input: string | undefined,
): boolean {
  if (!input) return false;
  const normalize = (code: string) => code.replace(/-/g, '').toUpperCase();
  const expected = Buffer.from(normalize(getTenantSetupCode(jwtSecret)));
  const actual = Buffer.from(normalize(input.trim()));
  return (
    expected.length === actual.length &&
    crypto.timingSafeEqual(expected, actual)
  );
}
