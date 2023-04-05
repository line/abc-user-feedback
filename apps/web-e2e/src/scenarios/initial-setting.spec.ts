import { expect, test } from '@playwright/test';

import clearTable from '../tasks/clear-table';

export default () => {
  test.beforeEach(async () => {
    await clearTable();
  });

  test('has title', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveURL(/\/tenant\/create/);
  });
};
