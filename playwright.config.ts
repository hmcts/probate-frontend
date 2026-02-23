import {defineConfig, devices} from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    timeout: 600000,
    testDir: './test/playwrightTest',
    expect: {
        timeout: 30000, // for all expect() assertions
    },

    use: {
    // Navigation timeout (affects goto, waitForLoadState, etc.)
        navigationTimeout: 60000,

        // Action timeout (affects click, fill, etc.)
        actionTimeout: 20000,
        // headless: false, // Run with visible browser
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on-first-retry',
    },

    projects: [

        /*{
      ...ProjectsConfig.chrome,
    },*/
        {
            name: 'chromium',
            use: {...devices['Desktop Chrome']},
        },

    /*{
      ...ProjectsConfig.edge,
    },
    {
      ...ProjectsConfig.firefox,
    },
    {
      ...ProjectsConfig.webkit,
    },
    {
      ...ProjectsConfig.tabletChrome,
    },
    {
      ...ProjectsConfig.tabletWebkit,
    },*/
    ],
});
