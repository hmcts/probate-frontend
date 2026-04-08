import { defineConfig, devices } from '@playwright/test';
import { testConfig } from './config/config';

export default defineConfig({
  testDir: './tests',
  timeout: 600000,
  expect: {
    timeout: 30000,
  },
  use: {
    baseURL: testConfig.frontendUrl,
    navigationTimeout: 60000,
    actionTimeout: 20000,
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
