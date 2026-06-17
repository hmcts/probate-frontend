import { test } from '../../fixtures';
const language = 'en';

test.describe('Cookie banner test', () => {
  test(('Check cookie banner in FE application start page'),
      async ({
               intestacyScreenerPage,
             }) => {

        // Screeners & Pre-IDAM
        await intestacyScreenerPage.clearAllCookies();
        await intestacyScreenerPage.startApplication(language, true);
    });
});
