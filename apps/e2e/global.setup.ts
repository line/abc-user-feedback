import { expect, test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('tenant create and authenticate', async ({ page }) => {
  await page.goto('http://localhost:3000/en/tenant/create');
  await page.getByLabel('Site name').click();
  await page.getByLabel('Site name').fill('TestTenant');
  await page.getByRole('button', { name: 'Setting', exact: true }).click();

  await page.goto('http://localhost:3000/en/auth/sign-in');
  await expect(page.getByRole('banner')).toHaveText(/TestTenant/, {
    timeout: 500000,
  });
  await page.getByPlaceholder('ID').click();
  await page.getByPlaceholder('ID').fill('user@feedback.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('12345678');
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await page.waitForURL('http://localhost:3000/en/main');

  await page.context().storageState({ path: authFile });
});
