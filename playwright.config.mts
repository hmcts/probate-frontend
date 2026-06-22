import { defineConfig, devices } from '@playwright/test';
import { CommonConfig, ProjectsConfig } from "@hmcts/playwright-common";
const browserName = process.env.BROWSER_NAME || 'default';

export default defineConfig({
  testDir: './test/playwrightTest',
  timeout: 360000,
  ...CommonConfig.recommended,
  expect: {
    timeout: 60000 // 30 seconds
  },

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Reporter */
  reporter: [
    ['html', { outputFolder: `./functional-output/reports/${browserName}`, open: 'never' }],
    ['json', { outputFile: './functional-output/results.json' }],
    ['list'], // Console output
  ],

  use: {
    /* Base URL */
    baseURL: process.env.TEST_URL ?? 'http://localhost:3000',
    acceptDownloads: true,

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
    /*{
      ...ProjectsConfig.chrome,
    },*/
    {
      ...ProjectsConfig.chromium,
      outputDir: './test-results/FullFunctionalTests',
    },
    {
      ...ProjectsConfig.edge,
      outputDir: './test-results/edge',
      grep: /@edge/,
    },
    {
      ...ProjectsConfig.firefox,
      outputDir: './test-results/firefox',
      grep: /@firefox/,
    },
    {
      ...ProjectsConfig.webkit,
      outputDir: './test-results/webkit',
      grep: /@webkit/,
    },
    {
      name: 'galaxyS4',
      outputDir: './test-results/galaxyS4',
      use: { ...devices['Galaxy S4'] },
      grep: /@galaxys4/,
    },
    {
      name: 'iPadPro11',
      outputDir: './test-results/ipadpro11',
      use: { ...devices['iPad Pro 11'] },
      grep: /@ipadpro11/,
    },
  ],
});
