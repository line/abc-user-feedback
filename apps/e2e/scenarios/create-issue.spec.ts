import { expect, test } from '@playwright/test';
import axios from 'axios';

export default () => {
  test.describe('create-issue suite', () => {
    test.afterEach(async ({ page }) => {
      await page
        .getByRole('button', { name: 'Delete' })
        .click({ timeout: 1000 });

      await expect(page.getByText('Delete').nth(3)).toBeVisible();
      await page.getByText('Delete').nth(3).click();
      await page.waitForTimeout(1000);

      await expect(page.locator('tbody')).not.toContainText('test text');
    });

    test('creating an issue and attaching it to a feedback succeeds', async ({
      page,
    }) => {
      await page.goto('http://localhost:3000', {
        waitUntil: 'domcontentloaded',
      });

      await page.getByRole('radio', { name: 'Issue' }).click();
      await page.getByRole('button', { name: 'Create Issue' }).click();
      await page.waitForTimeout(1000);
      await page.getByPlaceholder('Please enter.').first().fill('test_issue');
      await page.getByRole('button', { name: 'Save' }).click();
      await page.waitForTimeout(1000);

      await page.getByRole('radio', { name: 'Feedback' }).click();
      await page.waitForURL(/.*channelId.*/, { timeout: 1000 });

      await expect(page.getByText('There is no data yet')).toBeVisible();

      const url = new URL(page.url());
      const pathname = url.pathname;
      const segments = pathname.split('/');
      const projectId = segments[3];
      const params = new URLSearchParams(url.search);
      const channelId = params.get('channelId');

      await axios.post(
        `http://localhost:4000/api/projects/${projectId}/channels/${channelId}/feedbacks`,
        {
          message: 'test text',
        },
        { headers: { 'x-api-key': 'MASTER_API_KEY' } },
      );

      await page.goto(
        `http://localhost:3000/main/project/${projectId}/feedback?channelId=${channelId}`,
        { waitUntil: 'domcontentloaded' },
      );

      await page.waitForTimeout(2000);

      await expect(page.locator('tbody')).toContainText('test text');

      await page
        .locator('button[data-slot="popover-trigger"]:has-text("+")')
        .first()
        .click({ delay: 500 });
      await page.waitForTimeout(3000);

      await page.getByText('test_issue').first().click();
      await page.waitForTimeout(1000);

      await page
        .locator('button[data-slot="popover-trigger"]:has-text("+")')
        .first()
        .click();

      await page.getByText('test text').first().click();

      await page
        .locator('button[data-slot="popover-trigger"]:has-text("+")')
        .nth(1)
        .click();
      await page.waitForTimeout(1000);

      await page.keyboard.insertText('test_issue2');

      await page.getByText('Create', { exact: true }).click();
      await page.waitForTimeout(1000);

      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
    });
  });
};
