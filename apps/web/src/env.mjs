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
export const env = {
  NEXT_PUBLIC_API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
  API_BASE_URL: process.env.API_BASE_URL || 'http://127.0.0.1:4000',
  SESSION_PASSWORD:
    process.env.SESSION_PASSWORD ||
    'complex_password_at_least_32_characters_long',
  NEXT_PUBLIC_MAX_DAYS: parseNumEnv(process.env.NEXT_PUBLIC_MAX_DAYS, 90),
};

function parseNumEnv(env, defaultvalue) {
  const result = parseInt(env, 10);
  if (isNaN(result)) return defaultvalue;
  return result;
}
