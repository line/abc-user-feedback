import { expect, test } from '@playwright/test';

export default () => {
  test.describe('create-channel suite', () => {
    test('creating a channel succeeds', async ({ page }) => {
      await page.goto('http://localhost:3000', {
        waitUntil: 'domcontentloaded',
      });
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(5000);

      await page.getByRole('radio', { name: 'Settings' }).click();
      await page.waitForTimeout(1000);
      await page.getByText('Create Channel').click();
      await page.waitForTimeout(1000);
      await page.locator('input[name="name"]').click();
      await page.locator('input[name="name"]').fill('TestChannel');
      await page.getByRole('button', { name: 'Next' }).click();

      await page.getByText('Add Field').first().click();
      await page.waitForTimeout(500);

      await page.waitForSelector('input[name="key"]', { state: 'visible' });
      await page.locator('input[name="key"]').click();
      await page.locator('input[name="key"]').fill('message');
      await page.getByRole('button', { name: 'Confirm' }).click();

      await page.getByText('Add Field').first().click();
      await page.waitForTimeout(500);

      await page.waitForSelector('input[name="key"]', { state: 'visible' });
      await page.locator('input[name="key"]').click();
      await page.locator('input[name="key"]').fill('image');

      await page
        .locator('select[aria-hidden="true"]')
        .first()
        .selectOption('images');
      await page.waitForTimeout(500);

      await page.getByRole('button', { name: 'Confirm' }).click();

      await page.getByRole('button', { name: 'Complete' }).click();
      await page.waitForTimeout(1500);
      await page.getByRole('button', { name: 'Start' }).click();
      await page.waitForTimeout(1500);
      await expect(
        page.getByRole('tab', { name: 'TestChannel' }).first(),
      ).toContainText('TestChannel');
    });
  });
};
