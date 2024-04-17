import { expect, test } from '@playwright/test';
import axios from 'axios';

export default () => {
  test.describe('create-feedback suite', () => {
    test.afterEach(async ({ page }) => {
      await page
        .locator(
          '#__next > div > div > main > div > div.overflow-x-auto > table > tbody > tr:nth-child(1) > td:nth-child(1) > div > input',
        )
        .click();
      await page.getByRole('button', { name: 'Delete' }).click();
      await page.getByRole('button', { name: 'Delete' }).click();

      await expect(page.getByText('Deleted Successfully')).toBeVisible();
    });

    test('creating a feedback succeeds', async ({ page }) => {
      await page.goto('http://localhost:3000');
      await page.getByText('SeededTestProject').click();
      await page.getByText('FeedbackIssueSetting').hover();
      await page.getByRole('button', { name: 'Feedback', exact: true }).click();
      await page.getByRole('button', { name: 'Column Settings' }).hover();
      await page.getByText('SeededTestChannel', { exact: true }).click();
      await page.waitForURL(/.*channelId.*/, { timeout: 1000 });

      const url = new URL(page.url());
      const pathname = url.pathname;
      const segments = pathname.split('/');
      const projectId = segments[4];
      const params = new URLSearchParams(url.search);
      const channelId = params.get('channelId');

      const res = await axios.post(
        `http://localhost:4000/api/projects/${projectId}/channels/${channelId}/feedbacks`,
        {
          SeededTestTextField: 'test text',
        },
        {
          headers: {
            'x-api-key': 'MASTER_API_KEY',
          },
        },
      );

      await page.goto(
        `http://localhost:3000/en/main/project/${projectId}/feedback?channelId=${channelId}`,
      );
      await expect(page.locator('tbody')).toContainText('test text');
    });
  });
};
