import { expect, test as setup } from '@playwright/test';

import { initializeDatabaseForTest } from './utils/database-utils';
import { initializeOpenSearchForTest } from './utils/opensearch-utils';

const authFile = 'playwright/.auth/user.json';

setup('tenant create and authenticate', async ({ page }) => {
  try {
    await initializeDatabaseForTest();
    console.log('Database initialized for test');
  } catch (error) {
    console.warn(
      'Database initialization failed, continuing without database cleanup:',
      error,
    );
  }

  try {
    await initializeOpenSearchForTest();
    console.log('OpenSearch initialized for test');
  } catch (error) {
    console.warn(
      'OpenSearch initialization failed, continuing without OpenSearch:',
      error,
    );
  }

  await page.goto('http://localhost:3000/tenant/create');
  await page.waitForTimeout(1000);

  await page.locator("input[name='siteName']").click();
  await page.locator("input[name='siteName']").fill('TestTenant');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.waitForTimeout(1000);

  await page.locator("input[name='email']").click();
  await page.locator("input[name='email']").fill('user@feedback.com');

  await page.getByRole('button', { name: 'Request Code', exact: true }).click();

  await page.waitForSelector('input[name="code"]', {
    state: 'visible',
    timeout: 60000,
  });
  await page.locator("input[name='code']").click();
  await page.locator("input[name='code']").fill('000000');

  await page.getByRole('button', { name: 'Verify Code', exact: true }).click();

  await page.locator("input[name='password']").click();
  await page.locator("input[name='password']").fill('Abcd1234!');

  await page.locator("input[name='confirmPassword']").click();
  await page.locator("input[name='confirmPassword']").fill('Abcd1234!');

  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'Confirm', exact: true }).click();
  await page.waitForTimeout(1000);

  await page.goto('http://localhost:3000/auth/sign-in');
  await page.waitForTimeout(1000);

  await expect(page.locator('body', { hasText: 'TestTenant' })).toContainText(
    'TestTenant',
  );

  await page.locator("input[name='email']").click();
  await page.locator("input[name='email']").fill('user@feedback.com');
  await page.locator("input[name='password']").click();
  await page.locator("input[name='password']").fill('Abcd1234!');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.waitForTimeout(1000);

  await page.waitForURL('http://localhost:3000/main/project/create');

  await page.context().storageState({ path: authFile });
});
