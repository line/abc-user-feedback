import * as path from 'path';
import { defineConfig, devices } from '@playwright/test';

export const STORAGE_STATE = path.join(__dirname, 'playwright/.auth/user.json');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */

export default defineConfig({
  testDir: '.',
  /* Maximum time one test can run for. */
  timeout: 60 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 15 * 1000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  testMatch: 'test.list.*',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    video: 'on',
    screenshot: 'only-on-failure',
  },
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'global setup',
      testMatch: /global\.setup\.ts/,
      teardown: 'global teardown',
    },
    {
      name: 'global teardown',
      testMatch: /global\.teardown\.ts/,
    },
    {
      name: 'logged in chromium',
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
      dependencies: ['global setup'],
    },
    // {
    //   name: 'logged out chromium',
    //   testMatch: '**/sign-in*.spec.ts',
    //   use: { ...devices['Desktop Chrome'] },
    // },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: 'cd ../api && pnpm build && pnpm start',
      port: 4000,
      reuseExistingServer: true,
      env: {
        JWT_SECRET: 'jwtsecretjwtsecretjwtsecret',
        BASE_URL: 'http://localhost:3000',
        MYSQL_PRIMARY_URL:
          'mysql://userfeedback:userfeedback@localhost:13307/e2e',
        MYSQL_SECONDARY_URLS:
          '["mysql://userfeedback:userfeedback@localhost:13307/e2e"]',
        AUTO_MIGRATION: 'true',
        MASTER_API_KEY: 'MASTER_API_KEY',
        NODE_ENV: 'test',
        SMTP_HOST: 'localhost',
        SMTP_PORT: '25',
        SMTP_SENDER: 'abc@feedback.user',
        SMTP_BASE_URL: 'http://localhost:3000',
        OPENSEARCH_USE: 'true',
        OPENSEARCH_NODE: 'http://localhost:9200',
        OPENSEARCH_USERNAME: '',
        OPENSEARCH_PASSWORD: '',
      },
    },
    {
      command: 'cd ../web && pnpm build && pnpm start',
      port: 3000,
      reuseExistingServer: true,
      env: {
        NEXT_PUBLIC_API_BASE_URL: 'http://localhost:4000',
      },
    },
  ],
});
