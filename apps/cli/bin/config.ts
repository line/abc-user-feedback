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
  mysql: z.object({ port: z.number().default(13306) }),
});

export type AppConfig = z.infer<typeof ConfigSchema>;

export function loadConfig(cwd = process.cwd()): AppConfig {
  const mainPath = path.join(cwd, 'config.toml');
  if (!exists(mainPath))
    throw new Error(
      "config.toml 이 없습니다. 먼저 'mystack init'을 실행하세요.",
    );
  const main = TOML.parse(readFile(mainPath));
  const parsed = ConfigSchema.safeParse(main);
  if (!parsed.success)
    throw new Error(
      'config.toml 검증 실패:\n' +
        JSON.stringify(parsed.error.format(), null, 2),
    );
  return parsed.data;
}
