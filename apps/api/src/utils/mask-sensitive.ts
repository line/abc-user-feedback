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
const MASK = '****';

export const SENSITIVE_HEADER_KEYS = [
  'authorization',
  'proxy-authorization',
  'x-api-key',
  'cookie',
];
const SENSITIVE_BODY_KEYS = [
  'password',
  'clientsecret',
  'refreshtoken',
  'accesstoken',
  'apikey',
  'code',
];

export function maskHeaders<T extends Record<string, unknown>>(headers: T): T {
  const masked: Record<string, unknown> = { ...headers };
  for (const key of Object.keys(masked)) {
    if (SENSITIVE_HEADER_KEYS.includes(key.toLowerCase())) masked[key] = MASK;
  }
  return masked as T;
}

export function maskBody(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(maskBody);
  if (value === null || typeof value !== 'object') return value;

  const masked: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    masked[key] =
      SENSITIVE_BODY_KEYS.includes(key.toLowerCase()) ? MASK : maskBody(child);
  }
  return masked;
}
