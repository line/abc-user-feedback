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
import path from 'path';
import * as TOML from 'toml';
import { z } from 'zod';

import { exists, readFile } from './fsutil';

const ConfigSchema = z.object({
  web: z.object({
    port: z.number().default(3000),
    api_base_url: z.string().default('http://localhost:4000'),
  }),
  api: z.object({
    port: z.number().default(4000),
    jwt_secret: z.string().min(32).default('jwtsecretjwtsecretjwtsecret'),
    master_api_key: z.string().optional(),
    access_token_expired_time: z.string().optional(),
    refresh_token_expired_time: z.string().optional(),
    auto_feedback_deletion: z
      .object({
        enabled: z.boolean().default(false),
        period_days: z.number().optional(),
      })
      .optional(),
    smtp: z
      .object({
        host: z.string(),
        port: z.number(),
        sender: z.string(),
        username: z.string().optional(),
        password: z.string().optional(),
        tls: z.string().optional(),
        cipher_spec: z.string().optional(),
        opportunistic_tls: z.string().optional(),
      })
      .optional()
      .default({ host: 'smtp4dev', port: 25, sender: 'user@feedback.com' }),
    opensearch: z.object({ enabled: z.boolean().default(false) }).optional(),
  }),
  mysql: z.object({ port: z.number().default(13306) }).optional(),
});

export type AppConfig = z.infer<typeof ConfigSchema>;

export function loadConfig(cwd = process.cwd()): AppConfig {
  const mainPath = path.join(cwd, 'config.toml');
  if (!exists(mainPath))
    throw new Error(
      "config.toml 이 없습니다. 먼저 'mystack init'을 실행하세요.",
    );
  const main = TOML.parse(readFile(mainPath)) as unknown;
  const parsed = ConfigSchema.safeParse(main);
  if (!parsed.success)
    throw new Error(
      'config.toml 검증 실패:\n' +
        JSON.stringify(parsed.error.format(), null, 2),
    );
  return parsed.data;
}
