import { expect, test } from '@playwright/test';

export default () => {
  test('creating a project succeeds', async ({ page }) => {
    await page.goto('http://localhost:3000/main/project/create', {
      waitUntil: 'domcontentloaded',
    });

    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible({
      timeout: 60000,
    });
    await page.waitForTimeout(5000);

    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();

    await page.locator("input[name='name']").click();
    await page.locator("input[name='name']").fill('TestProject');

    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(1500);

    await page.getByRole('button', { name: 'Next' }).click();
    await page.waitForTimeout(1500);

    await page.getByRole('button', { name: 'Complete' }).click();
    await page.waitForTimeout(1500);

    await expect(
      page.getByRole('heading', {
        level: 2,
        name: /project creation complete/i,
      }),
    ).toBeVisible();
    await expect(page.locator("input[name='name']")).toHaveValue('TestProject');
    await page.getByRole('button', { name: 'Later' }).click();
  });
};
