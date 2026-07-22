import { test, expect } from '../../../fixtures/index.ts';
import { BasePage, getTestLanguages } from '../../../pages/utility/basePage.ts';
import { Page, BrowserContext } from '@playwright/test';
import { TestConfigurator } from '../../../pages/utility/testConfigurator.ts';
import deceasedDetailsConfig from '../../../data/deceasedDetailsConfig.json' with { type: 'json' };
import ihtDataConfig from '../../../data/ee/ihtData.json' with { type: 'json' };
import applicantDetailConfig from '../../../data/intestacy/sole/applicantDetails.json' with { type: 'json' };
import { PcqPage } from '../../../pages/pcq/pcqPage.js'

const optionYes = ihtDataConfig.optionYes;
const optionNo = ihtDataConfig.optionNo;
const bilingualGOP = false;
const totalExecutors = '1';

getTestLanguages().forEach(language => {
  test.describe('GOP Single Executor journey @preview', () => {
    test.describe.configure({ mode: 'serial' });

    test.use({ language });

    let testConfigurator: TestConfigurator;
    let context: BrowserContext;
    let page: Page;
    let basePage: BasePage;

    test.beforeEach(async () => {
      testConfigurator = new TestConfigurator();
      basePage = new BasePage(page, context, language);
      await testConfigurator.getBefore();
    });

    test.afterEach(async () => {
      await testConfigurator.getAfter();
    });

    test(`${language.toUpperCase()} Go to application task list page to complete deceased and applicant details`, async ({
                                                                                                                           intestacyScreenerPage,
                                                                                                                           gopScreenerPage,
                                                                                                                           apiCallback,
                                                                                                                           signInPage,
                                                                                                                           taskListPage,
                                                                                                                           deceasedDetailsPage,
                                                                                                                           applicantDetailsPage,
                                                                                                                           executorDetailsPage,
                                                                                                                           cyaAndDeclarationPage,
                                                                                                                           paymentTaskPage,
                                                                                                                         }) => {
      const scenarioName = `GOP Single Executor journey - ${language}`;
      const localTestConfigurator = new TestConfigurator();

      await apiCallback.createAUser(localTestConfigurator);

      await basePage.logInfo(scenarioName, 'Intestacy screener questions', null);
      await intestacyScreenerPage.startApplication(language);
      await intestacyScreenerPage.selectDeathCertificate(language);
      await intestacyScreenerPage.selectDeathCertificateInEnglish(language, optionNo);
      await intestacyScreenerPage.selectDeathCertificateTranslation(language, optionYes);
      await intestacyScreenerPage.selectDeceasedDomicile(language);
      await intestacyScreenerPage.selectEEDeceasedDod(language, optionNo);
      await intestacyScreenerPage.selectIhtCompleted(language, optionYes);
      await intestacyScreenerPage.selectPersonWhoDiedLeftAWill(language, optionYes);

      await gopScreenerPage.selectOriginalWill(language, optionYes);
      await gopScreenerPage.selectApplicantIsExecutor(language, optionYes);
      await gopScreenerPage.selectMentallyCapable(language, optionYes);

      await signInPage.authenticateWithIdamIfAvailable(language);

      await expect(signInPage.page).toHaveURL(/\/(start-apply|task-list)/, { timeout: 60_000 });
      let currentUrl = signInPage.page.url();
      console.log('Current URL after first sign-in:', currentUrl);

      if (currentUrl.includes('/start-apply')) {
        const possibleControls = [
          signInPage.page.getByRole('button', { name: /start now/i }),
          signInPage.page.getByRole('link', { name: /start now/i }),
          signInPage.page.getByRole('button', { name: /continue/i }),
          signInPage.page.getByRole('link', { name: /continue/i }),
          signInPage.page.getByRole('button', { name: /save and continue/i }),
          signInPage.page.getByRole('link', { name: /save and continue/i }),
          signInPage.page.getByRole('button', { name: /apply now/i }),
          signInPage.page.getByRole('link', { name: /apply now/i }),
          signInPage.page.locator('.govuk-button').first(),
          signInPage.page.locator('a.govuk-button').first(),
          signInPage.page.locator('input.govuk-button').first(),
        ];

        let clicked = false;

        for (const control of possibleControls) {
          if (await control.isVisible().catch(() => false)) {
            await control.click();
            clicked = true;
            break;
          }
        }

        if (!clicked) {
          throw new Error(
            `After sign-in user is on /start-apply but no continue/start control was found. Current URL: ${currentUrl}`,
          );
        }

        await signInPage.authenticateWithIdamIfAvailable(language);

        await expect(signInPage.page).toHaveURL(/\/(start-apply|task-list)/, { timeout: 60_000 });
        currentUrl = signInPage.page.url();
        console.log('Current URL after start-apply action:', currentUrl);

        if (currentUrl.includes('/start-apply')) {
          const possibleControlsSecondPass = [
            signInPage.page.getByRole('button', { name: /start now/i }),
            signInPage.page.getByRole('link', { name: /start now/i }),
            signInPage.page.getByRole('button', { name: /continue/i }),
            signInPage.page.getByRole('link', { name: /continue/i }),
            signInPage.page.getByRole('button', { name: /save and continue/i }),
            signInPage.page.getByRole('link', { name: /save and continue/i }),
            signInPage.page.getByRole('button', { name: /apply now/i }),
            signInPage.page.getByRole('link', { name: /apply now/i }),
            signInPage.page.locator('.govuk-button').first(),
            signInPage.page.locator('a.govuk-button').first(),
            signInPage.page.locator('input.govuk-button').first(),
          ];

          let clickedAgain = false;

          for (const control of possibleControlsSecondPass) {
            if (await control.isVisible().catch(() => false)) {
              await control.click();
              clickedAgain = true;
              break;
            }
          }

          if (clickedAgain) {
            await signInPage.authenticateWithIdamIfAvailable(language);
          }
        }

        await expect(signInPage.page).toHaveURL(/\/task-list/, { timeout: 60_000 });
      }

      await basePage.logInfo(scenarioName, 'Deceased Details Task', null);
      await taskListPage.selectATask(language, 'deceasedTask');
      await deceasedDetailsPage.chooseBiLingualGrant(optionNo);

      await deceasedDetailsPage.enterDeceasedDetails('GOP',
        applicantDetailConfig.deceasedFirstName,
        applicantDetailConfig.deceasedLastName,
      );

      await deceasedDetailsPage.enterDeceasedNameOnWill(language, optionYes);
      await deceasedDetailsPage.enterDobDetails(language, '01', '01', '1950');
      await deceasedDetailsPage.enterDodDetails(
        deceasedDetailsConfig.deceasedDodDay,
        deceasedDetailsConfig.deceasedDodMonth,
        deceasedDetailsConfig.deceasedDodYear,
      );
      await deceasedDetailsPage.enterDeceasedAddress();
      await deceasedDetailsPage.selectDiedEngOrWales(optionNo);
      await deceasedDetailsPage.selectEnglishForeignDeathCert(language, optionNo);
      await deceasedDetailsPage.selectForeignDeathCertTranslation(language, optionYes);

      await deceasedDetailsPage.enterGrossAndNet('205');
      await deceasedDetailsPage.enterProbateAssetValues('500', '400');
      await deceasedDetailsPage.selectDeceasedAliasGop(language, optionNo);
      await deceasedDetailsPage.selectDeceasedMarriedAfterDateOnWill(optionNo);
      await deceasedDetailsPage.selectWillDamage(optionYes, 'test');
      await deceasedDetailsPage.selectWillDamageReason(optionYes, 'test');
      await deceasedDetailsPage.selectWillDamageWho(optionYes, 'test', 'test');
      await deceasedDetailsPage.selectWillDamageDate(optionYes, '2017');
      await deceasedDetailsPage.selectWillCodicils(optionYes);
      await deceasedDetailsPage.selectWillNoOfCodicils('1');
      await deceasedDetailsPage.selectCodicilsDamage(optionYes, 'test');
      await deceasedDetailsPage.selectCodicilsReason(optionYes, 'test');
      await deceasedDetailsPage.selectCodicilsWho(optionYes, 'test', 'test');
      await deceasedDetailsPage.selectCodicilsDate(optionYes, '2000');
      await deceasedDetailsPage.selectWrittenWishes(optionYes);

      await basePage.logInfo(scenarioName, 'Applicant details task', null);
      await taskListPage.selectATask(language, 'applicantsTask');
      await applicantDetailsPage.enterApplicantName(language, 'Applicant First Name', 'Applicant Last Name');

      await executorDetailsPage.selectNameAsOnTheWill(optionYes);
      await executorDetailsPage.enterApplicantPhoneNumber();
      await applicantDetailsPage.enterAddressManually();
      await executorDetailsPage.continueCheckWillExecutors();
      await executorDetailsPage.enterExecutorNamed(totalExecutors, optionNo);

      await basePage.logInfo(scenarioName, 'CYA and Legal Declaration', null);
      await taskListPage.selectATask(language, 'reviewAndConfirmTask');
      await cyaAndDeclarationPage.seeSummaryPage(language, 'declaration');

      const popupPromise = page.waitForEvent('popup').catch(() => null);
      const contextPagePromise = page.context().waitForEvent('page').catch(() => null);

      await cyaAndDeclarationPage.acceptDeclaration(language, bilingualGOP);

      const pcqPopup = await popupPromise;
      const pcqContextPage = await contextPagePromise;
      const pcqBrowserPage = pcqPopup ?? pcqContextPage ?? page;

      await pcqBrowserPage.waitForLoadState('domcontentloaded');
      await expect(pcqBrowserPage).toHaveURL(/pcq|opt-out|probate/, { timeout: 60000 });

      const optOutButton = pcqBrowserPage.locator(
        'button[name="opt-out-button"][formaction="/opt-out"]'
      );

      await expect(optOutButton).toBeVisible({ timeout: 30000 });
      await optOutButton.click();

      await pcqBrowserPage.waitForURL(/opt-out|probate/, { timeout: 60000 });

      if (pcqBrowserPage !== page) {
        await page.bringToFront();
        await page.waitForURL(/task-list|payment-summary|summary|check-your-answers/, { timeout: 60000 });
      }

      await page.waitForURL(/\/opt-out|probate\.aat\.platform\.hmcts\.net\//, { timeout: 60000 });
      console.log('After opt-out click:', page.url());
      await page.bringToFront();

      await basePage.logInfo(scenarioName, 'Payment details task', null);
      await taskListPage.selectATask(language, 'paymentTask');

      if (localTestConfigurator.getUseGovPay() === 'true') {
        await paymentTaskPage.enterUkCopies(language, '5');
        await paymentTaskPage.selectOverseasAssets(optionYes);
        await paymentTaskPage.enterOverseasCopies('2');
      } else {
        await paymentTaskPage.enterUkCopies(language, '0');
        await paymentTaskPage.selectOverseasAssets(optionNo);
      }

      await paymentTaskPage.seeCopiesSummary(language);
      await paymentTaskPage.seePaymentBreakdownPage(language);

      if (localTestConfigurator.getUseGovPay() === 'true') {
        await paymentTaskPage.seeGovUkPaymentPage(language);
        await paymentTaskPage.seeGovUkConfirmPage(language);
      }

      const caseId = await paymentTaskPage.seeThankYouPage(language);
      await basePage.logInfo(scenarioName, 'Application submitted successfully', `${caseId}`);
    });
  });
});
