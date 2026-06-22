import { test } from '../../fixtures/fixtures.ts';
import { BasePage } from '../../pages/utility/basePage.ts';
const language = 'en';

test.describe('Cookie banner test', () => {
  let basePage: BasePage;

  test(('Check cookie banner in FE application start page'),
      async ({
               intestacyScreenerPage,
             }) => {
        const scenarioName = `Intestacy child co-applicant journey - EE Yes - ${language}`;

        // Screeners & Pre-IDAM
        await basePage.logInfo(scenarioName, "Clear cookies in check eligibility page", null);
        await intestacyScreenerPage.clearAllCookies();
        await intestacyScreenerPage.startApplication(language, true);
    });
});
