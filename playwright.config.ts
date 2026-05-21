import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test/playwrightTest',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Reporter */
  reporter: 'html',

  use: {
    /* Base URL */
    baseURL: process.env.TEST_URL ?? 'http://localhost:3000',

    /* Collect trace when retrying */
    trace: 'on-first-retry',

    /* Browser options */
    headless: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
