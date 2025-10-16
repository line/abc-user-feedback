import { expect, test } from '@playwright/test';
import axios from 'axios';

export default () => {
  test.describe('create-feedback-with-image suite', () => {
    test.afterEach(async ({ page }) => {
      await page.getByText('test text').first().click();
      await page.waitForTimeout(2000);
      await page.getByRole('button', { name: 'Delete' }).click();

      await expect(page.getByText('Delete').nth(3)).toBeVisible();
      await page.getByText('Delete').nth(3).click();
      await page.waitForTimeout(2000);

      await expect(page.locator('tbody')).not.toContainText('test text');
    });

    test('creating a feedback with image succeeds', async ({ page }) => {
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
          message: 'test text',
          image: [
            'https://lps-editor-2050.landpress.line.me/logo/logo_line_color.svg',
          ],
        },
        { headers: { 'x-api-key': 'MASTER_API_KEY' } },
      );

      await page.goto(
        `http://localhost:3000/main/project/${projectId}/feedback?channelId=${channelId}`,
        { waitUntil: 'domcontentloaded' },
      );
      await page.waitForTimeout(2000);

      await page.getByText('Image').nth(1).click();
      await page.waitForTimeout(2000);

      await page.getByText('Cancel').nth(1).click();
      await page.waitForTimeout(2000);
    });
  });
};
