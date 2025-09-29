#!/usr/bin/env node
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
import { Command } from 'commander';

import packageJson from '../package.json';
import { generateComposeContent } from './compose';
import { loadConfig } from './config';
import { exists, writeFile } from './fsutil';
import { run, runWithStdin } from './shell';

const program = new Command();
program
  .name('auf-cli')
  .description('Tiny stack CLI (config.toml only)')
  .version(packageJson.version);

program
  .command('init')
  .description('Generate config.toml template — use without .env')
  .option('--force', 'Overwrite existing file')
  .action((opts: { force?: boolean }) => {
    if (exists('config.toml') && !opts.force)
      throw new Error('config.toml already exists. Use --force to overwrite.');
    writeFile('config.toml', defaultConfigToml());
    console.log('✅ Created: config.toml');
  });

program
  .command('start')
  .description('Start services with docker compose up -d based on config.toml')
  .action(async () => {
    const cfg = loadConfig();

    const composeContent = generateComposeContent(cfg);
    await runWithStdin(
      'docker',
      ['compose', '-f', '-', 'up', '-d', '--remove-orphans'],
      composeContent,
    );

    console.log('🚀 Services started successfully!');
    console.log('🔗 Available URLs:');
    console.log(`   📱 Web: http://localhost:${cfg.web.port}`);
    console.log(`   🔧 API: http://localhost:${cfg.api.port}`);
    if (cfg.mysql) {
      console.log(
        `   🗄️  MySQL: mysql://userfeedback:userfeedback@localhost:${cfg.mysql.port}`,
      );
    }
    if (cfg.api.opensearch?.enabled) {
      console.log(`   🔍 OpenSearch: http://localhost:9200`);
    }
    if (cfg.api.smtp.host === 'smtp4dev') {
      console.log(`   📧 SMTP Mail Web: http://localhost:5080`);
    }
  });

program
  .command('stop')
  .description('Stop services with docker compose down')
  .action(async () => {
    const cfg = loadConfig();

    const composeContent = generateComposeContent(cfg);
    await runWithStdin(
      'docker',
      ['compose', '-f', '-', 'down'],
      composeContent,
    );
    console.log('🛑 Services stopped successfully');
  });

program
  .command('clean')
  .description('Clean up containers/networks/volumes')
  .option('--images', 'Also prune images')
  .action(async (opts: { images?: boolean }) => {
    const cfg = loadConfig();

    const composeContent = generateComposeContent(cfg);
    await runWithStdin(
      'docker',
      ['compose', '-f', '-', 'down', '--volumes', '--remove-orphans'],
      composeContent,
    );

    if (opts.images) await run('docker', ['image', 'prune', '-f']);
    console.log('🧹 Cleanup completed successfully');
  });

program.parseAsync().catch((e: Error) => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});

function defaultConfigToml() {
  return `
[web]
port = 3000
# api_base_url = "http://localhost:4000"

[api]
port = 4000
jwt_secret = "jwtsecretjwtsecretjwtsecretjwtsecretjwtsecretjwtsecret"

# master_api_key = "MASTER_KEY"
# access_token_expired_time = "10m"
# refresh_token_expired_time = "1h"

# [api.auto_feedback_deletion]
# enabled = true
# period_days = 365

# [api.smtp]
# host = "smtp4dev" # SMTP_HOST
# port = 25 # SMTP_PORT
# sender = "user@feedback.com"
# username= 
# password= 
# tls=
# ciper_spec=
# opportunitic_tls=


# [api.opensearch]
# enabled = true

[mysql]
port = 13306
`;
}
