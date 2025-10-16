import { expect, test } from '@playwright/test';
import axios from 'axios';

export default () => {
  test.describe('search-feedback suite', () => {
    test('creating and searching a feedback succeed', async ({ page }) => {
      await page.goto('http://localhost:3000', {
        waitUntil: 'domcontentloaded',
      });

      await page.getByRole('radio', { name: 'Feedback' }).click();
      await page.waitForURL(/.*channelId.*/, { timeout: 10000 });

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
          message: 'test text1',
        },
        { headers: { 'x-api-key': 'MASTER_API_KEY' } },
      );

      await axios.post(
        `http://localhost:4000/api/projects/${projectId}/channels/${channelId}/feedbacks`,
        {
          message: 'test text2',
        },
        { headers: { 'x-api-key': 'MASTER_API_KEY' } },
      );

      await page.goto(
        `http://localhost:3000/main/project/${projectId}/feedback?channelId=${channelId}`,
        { waitUntil: 'domcontentloaded' },
      );

      await page.waitForTimeout(2000);

      await expect(page.locator('tbody')).toContainText('test text1');
      await expect(page.locator('tbody')).toContainText('test text2');

      await page.getByText('Filter').click();
      await page.waitForTimeout(2000);

      await page.getByRole('button', { name: 'ID' }).click();
      await page.waitForTimeout(500);

      await page.getByRole('option', { name: 'message' }).click();

      await page.getByPlaceholder('Please enter').fill('test text1');

      await page.getByRole('button', { name: 'Confirm' }).click();
      await page.waitForTimeout(500);

      await expect(page.locator('tbody')).toContainText('test text1');
      await expect(page.locator('tbody')).not.toContainText('test text2');

      await page.waitForTimeout(500);
    });
  });
};
