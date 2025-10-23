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
import mysql from 'mysql2/promise';

export async function createConnection() {
  return await mysql.createConnection({
    host: '127.0.0.1',
    port: 13307,
    user: 'userfeedback',
    password: 'userfeedback',
    database: 'e2e',
  });
}

export async function waitForDatabase(
  maxRetries = 30,
  delayMs = 1000,
): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const connection = await createConnection();
      await connection.ping();
      await connection.end();
      console.log('Database is ready');
      return;
    } catch (error) {
      console.log(`Waiting for database... (${i + 1}/${maxRetries})`);
      if (i === maxRetries - 1) {
        throw new Error(
          `Database is not available after ${maxRetries} retries`,
        );
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

export async function clearDatabaseTables(): Promise<void> {
  const connection = await createConnection();

  try {
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

    const [tables] = (await connection.execute(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'e2e' AND TABLE_TYPE = 'BASE TABLE'",
    )) as [mysql.RowDataPacket[], mysql.FieldPacket[]];

    for (const table of tables) {
      const tableName = table.TABLE_NAME;
      if (tableName !== 'migrations') {
        console.log(`Clearing table: ${tableName}`);
        await connection.execute(`DELETE FROM \`${tableName}\``);
        await connection.execute(
          `ALTER TABLE \`${tableName}\` AUTO_INCREMENT = 1`,
        );
      }
    }

    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Database tables cleared');
  } catch (error) {
    console.log('Error clearing database tables:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

export async function initializeDatabaseForTest(): Promise<void> {
  try {
    await waitForDatabase();
    await clearDatabaseTables();
    console.log('Database initialized for test');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

export async function cleanupDatabaseAfterTest(): Promise<void> {
  try {
    await clearDatabaseTables();
    console.log('Database cleaned up after test');
  } catch (error) {
    console.error('Failed to cleanup database:', error);
  }
}
