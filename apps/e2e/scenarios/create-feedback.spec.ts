import { expect, test } from '@playwright/test';
import axios from 'axios';
import dayjs from 'dayjs';

export default () => {
  test.describe('create-feedback suite', () => {
    test.afterEach(async ({ page }) => {
      await page.getByText('test text').first().click();
      await page.getByRole('button', { name: 'Delete' }).click();

      await expect(page.getByText('Delete').nth(3)).toBeVisible();
      await page.getByText('Delete').nth(3).click();
      await page.waitForTimeout(2000);

      await expect(page.locator('tbody')).not.toContainText('test text');
    });

    test('creating a feedback succeeds', async ({ page }) => {
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
        },
        { headers: { 'x-api-key': 'MASTER_API_KEY' } },
      );

      await page.goto(
        `http://localhost:3000/main/project/${projectId}/feedback?channelId=${channelId}`,
        { waitUntil: 'domcontentloaded' },
      );

      await page.waitForTimeout(2000);

      await expect(page.locator('tbody')).toContainText('test text');

      let dateSelector = page.getByText(
        `${dayjs().subtract(364, 'day').format('YYYY-MM-DD')} ~ ${dayjs().format('YYYY-MM-DD')}`,
      );

      await expect(dateSelector).toBeVisible();
      await dateSelector.click();
      await page.getByText('Yesterday').click();
      await page.getByText('Save').click();
      await page.waitForTimeout(2000);

      await expect(page.getByText('There is no data yet')).toBeVisible();

      dateSelector = page.getByText(
        `${dayjs().subtract(1, 'day').format('YYYY-MM-DD')} ~ ${dayjs().subtract(1, 'day').format('YYYY-MM-DD')}`,
      );
      await dateSelector.click();
      await page.getByText('Today').click();
      await page.getByText('Save').click();
      await page.waitForTimeout(2000);
    });
  });
};
