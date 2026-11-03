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
// Any body key containing one of these (case-insensitive) is masked, so
// variants such as newPassword, secretAccessKey or refreshToken are covered.
const SENSITIVE_BODY_KEY_PARTS = ['password', 'secret', 'token', 'apikey'];
const SENSITIVE_BODY_KEYS = ['code'];
// Keys that are only secret on some routes, e.g. the custom key value sent
// when creating an API key.
const SENSITIVE_BODY_KEYS_BY_PATH: [RegExp, string[]][] = [
  [/\/api-keys(\/|\?|$)/, ['value']],
];

const isSensitiveBodyKey = (key: string, pathKeys: string[]) => {
  const lower = key.toLowerCase();
  return (
    SENSITIVE_BODY_KEYS.includes(lower) ||
    pathKeys.includes(lower) ||
    SENSITIVE_BODY_KEY_PARTS.some((part) => lower.includes(part))
  );
};

export function maskHeaders<T extends Record<string, unknown>>(headers: T): T {
  const masked: Record<string, unknown> = { ...headers };
  for (const key of Object.keys(masked)) {
    if (SENSITIVE_HEADER_KEYS.includes(key.toLowerCase())) masked[key] = MASK;
  }
  return masked as T;
}

export function maskBody(value: unknown, url?: string): unknown {
  const pathKeys =
    url ?
      SENSITIVE_BODY_KEYS_BY_PATH.filter(([pattern]) =>
        pattern.test(url),
      ).flatMap(([, keys]) => keys)
    : [];
  return maskValue(value, pathKeys);
}

function maskValue(value: unknown, pathKeys: string[]): unknown {
  if (Array.isArray(value)) return value.map((v) => maskValue(v, pathKeys));
  if (value === null || typeof value !== 'object') return value;

  const masked: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    masked[key] =
      isSensitiveBodyKey(key, pathKeys) ? MASK : maskValue(child, pathKeys);
  }
  return masked;
}
