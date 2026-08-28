import { test } from '../../fixtures/fixtures.ts';
import { BasePage } from '../../pages/utility/basePage.ts';
import { Page, BrowserContext} from "@playwright/test";
const language = 'en';

test.describe('Cookie banner test @ipadpro11', () => {
  let context: BrowserContext;
  let page: Page;
  let basePage: BasePage;

  test(('Check cookie banner in FE application start page'),
      async ({
               intestacyScreenerPage,
             }) => {
        const scenarioName = `Intestacy child co-applicant journey - EE Yes - ${language}`;

        basePage = new BasePage(page, context, language);

        // Screeners & Pre-IDAM
        await basePage.logInfo(scenarioName, "Clear cookies in check eligibility page", null);
        await intestacyScreenerPage.clearAllCookies();
        await intestacyScreenerPage.startApplication(language, true);
    });
});
