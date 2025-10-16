import { test as teardown } from '@playwright/test';

import { createConnection } from './database-utils';
import { cleanupOpenSearchAfterTest } from './opensearch-utils';

export async function globalTeardown() {
  const connection = await createConnection();
  try {
    await connection.execute(`DELETE FROM tenant WHERE site_name = ?`, [
      'TestTenant',
    ]);
    await connection.execute('ALTER TABLE tenant AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE projects AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE channels AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE fields AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE feedbacks AUTO_INCREMENT = 1');
    await connection.execute(`DELETE FROM users WHERE email = ?`, [
      'user@feedback.com',
    ]);
    await connection.execute('ALTER TABLE users AUTO_INCREMENT = 1');
    await connection.execute('DELETE FROM histories');
    await connection.execute('ALTER TABLE histories AUTO_INCREMENT = 1');
  } finally {
    await connection.end();
  }
}

teardown('teardown', async () => {
  try {
    await globalTeardown();

    try {
      await cleanupOpenSearchAfterTest();
    } catch (error) {
      console.warn('OpenSearch cleanup failed:', error);
    }

    console.log('Tearing down succeeds.');
  } catch (e) {
    console.log('Tearing down fails.', e);
  }
});
