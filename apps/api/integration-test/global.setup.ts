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
import { join } from 'path';
import { createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { createConnection as connect } from './database-utils';

process.env.NODE_ENV = 'test';
process.env.MYSQL_PRIMARY_URL =
  'mysql://root:userfeedback@localhost:13307/integration';
process.env.MYSQL_SECONDARY_URLS = JSON.stringify([
  'mysql://root:userfeedback@localhost:13307/integration',
]);
process.env.MASTER_API_KEY = 'master-api-key';
process.env.AUTO_FEEDBACK_DELETION_ENABLED = 'true';
process.env.AUTO_FEEDBACK_DELETION_PERIOD_DAYS = '30';

async function createTestDatabase() {
  const connection = await connect();

  await connection.query(`DROP DATABASE IF EXISTS integration;`);
  await connection.query(`CREATE DATABASE IF NOT EXISTS integration;`);
  await connection.end();
}

async function runMigrations() {
  const connection = await createConnection({
    type: 'mysql',
    host: '127.0.0.1',
    port: 13307,
    username: 'root',
    password: 'userfeedback',
    database: 'integration',
    migrations: [
      join(
        __dirname,
        '../src/configs/modules/typeorm-config/migrations/*.{ts,js}',
      ),
    ],
    migrationsTableName: 'migrations',
    namingStrategy: new SnakeNamingStrategy(),
    timezone: '+00:00',
  });

  await connection.runMigrations();
  await connection.close();
}

export default async () => {
  await createTestDatabase();
  await runMigrations();
};
