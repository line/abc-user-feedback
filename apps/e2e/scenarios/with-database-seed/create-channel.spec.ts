import { expect, test } from '@playwright/test';

export default () => {
  test.describe('create-channel suite', () => {
    test('creating a channel succeeds', async ({ page }) => {
      await page.goto('http://localhost:3000');
      await page.waitForTimeout(1000);

      await page.getByText('SeededTestProject').click();
      await page.getByText('FeedbackIssueSetting').hover();
      await page.getByRole('button', { name: 'Settings' }).click();
      await page.getByRole('button', { name: 'Create Channel' }).click();
      await page.getByPlaceholder('Please enter Channel Name.').click();
      await page
        .getByPlaceholder('Please enter Channel Name.')
        .fill('TestChannel');
      await page.getByPlaceholder('Please enter Channel Description.').click();
      await page
        .getByPlaceholder('Please enter Channel Description.')
        .fill('Channel for test');
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Next' }).click();
      await page.getByRole('button', { name: 'Complete' }).click();
      await expect(page.locator('#Channel\\ Name')).toHaveValue('TestChannel');
      await expect(page.locator('#Channel\\ Description')).toHaveValue(
        'Channel for test',
      );
    });
  });
};
