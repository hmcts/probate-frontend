import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test/playwrightTest',
  timeout: 360000,

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

    // Navigation timeout (affects goto, waitForLoadState, etc.)
    navigationTimeout: 60000,

    // Action timeout (affects click, fill, etc.)
    actionTimeout: 40000,
    // headless: false, // Run with visible browser
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

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
