import { test as teardown } from '@playwright/test';

import { cleanupDatabaseAfterTest } from './utils/database-utils';
import { cleanupOpenSearchAfterTest } from './utils/opensearch-utils';

teardown('teardown', async () => {
  try {
    try {
      await cleanupDatabaseAfterTest();
    } catch (error) {
      console.warn('Database cleanup failed:', error);
    }

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
