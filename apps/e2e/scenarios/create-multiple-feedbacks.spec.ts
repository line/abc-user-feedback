import { expect, test } from '@playwright/test';
import axios from 'axios';

const NUMBER_OF_FEEDBACKS = 25;

export default () => {
  test.describe('create-multiple-feedbacks suite', () => {
    test.afterEach(async ({ page }) => {
      await page.getByRole('checkbox').nth(1).click();

      await page.getByText('Delete Feedback').click();
      await page.waitForTimeout(2000);

      await page.getByRole('button', { name: 'Delete' }).click();
      await page.waitForTimeout(2000);

      await page.getByRole('checkbox').first().click();

      await page.getByText('Delete Feedback').click();
      await page.waitForTimeout(2000);

      await page.getByRole('button', { name: 'Delete' }).click();
      await page.waitForTimeout(2000);
    });

    test('creating multiple feedbacks succeeds', async ({ page }) => {
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

      for (let i = 0; i < NUMBER_OF_FEEDBACKS; i++) {
        await axios.post(
          `http://localhost:4000/api/projects/${projectId}/channels/${channelId}/feedbacks`,
          {
            message: `test text ${i}`,
          },
          { headers: { 'x-api-key': 'MASTER_API_KEY' } },
        );
      }

      await page.goto(
        `http://localhost:3000/main/project/${projectId}/feedback?channelId=${channelId}`,
        { waitUntil: 'domcontentloaded' },
      );

      await page.waitForTimeout(2000);

      await expect(page.locator('tbody')).toContainText('test text');

      await expect(page.getByText('Page 1 of 2')).toBeVisible();

      await page.getByRole('button', { name: '20', exact: true }).click();
      await page.waitForTimeout(2000);

      await page.getByRole('menuitem', { name: '30', exact: true }).click();
      await page.waitForTimeout(2000);
    });
  });
};
