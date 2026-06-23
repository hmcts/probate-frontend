import { test } from '../../../fixtures/index.ts';
import { BasePage, getTestLanguages } from '../../../pages/utility/basePage.ts';
import { Page, BrowserContext} from "@playwright/test";

import { TestConfigurator } from "../../../pages/utility/testConfigurator.ts";
import ihtDataConfig from "../../../data/ee/ihtData.json" with { type: "json" };
import deceasedDetailsConfig from "../../../data/deceasedDetailsConfig.json" with { type: "json" };

const optionYes = ihtDataConfig.optionYes;
const optionNo = ihtDataConfig.optionNo;
const bilingualGOP = false;

getTestLanguages().forEach(language => {
  test.describe('GOP Single Executor journey - IHT 205 and Survey test @galaxys4', () => {
    test.describe.configure({ mode: 'serial' });

    test.use({ language });
    let testConfigurator: TestConfigurator;
    let context: BrowserContext;
    let page: Page;
    let basePage: BasePage;

    test.beforeEach(async () => {
      testConfigurator = new TestConfigurator();
      basePage = new BasePage(page, context, language);
      await testConfigurator.getBefore(); // creates unique user for this language
    });

    test.afterEach(async () => {
      await testConfigurator.getAfter(); // only deletes THIS language's user
    });

    test((`${language.toUpperCase()} GOP Single Executor journey - IHT 205 and Survey test`),
      async ({
               intestacyScreenerPage,
               gopScreenerPage,
               apiCallback,
               signInPage,
               taskListPage,
               deceasedDetailsPage,
               applicantDetailsPage,
               executorDetailsPage,
               cyaAndDeclarationPage,
               paymentTaskPage
      }) => {
      const testConfigurator = new TestConfigurator();
        const scenarioName = `GOP single executor journey - IHT 205 - ${language}`;

      await apiCallback.createAUser(testConfigurator);

      // Eligibility Task (pre IdAM)
      await basePage.logInfo(scenarioName, "Intestacy screener questions", null);
      await intestacyScreenerPage.startApplication(language);

      // Probate Sceeners
      await intestacyScreenerPage.selectDeathCertificate(language);

      await intestacyScreenerPage.selectDeathCertificateInEnglish(language, optionNo);
      await intestacyScreenerPage.selectDeathCertificateTranslation(language, optionYes);

      await intestacyScreenerPage.selectDeceasedDomicile(language);
      await intestacyScreenerPage.selectEEDeceasedDod(language, optionNo);
      await intestacyScreenerPage.selectIhtCompleted(language, optionYes);
      await intestacyScreenerPage.selectPersonWhoDiedLeftAWill(language, optionYes);

      // GOP Sceeners
      await gopScreenerPage.selectOriginalWill(language, optionYes);
      await gopScreenerPage.selectApplicantIsExecutor(language, optionYes);
      await gopScreenerPage.selectMentallyCapable(language, optionYes);

      await intestacyScreenerPage.startApply(language);

      // IdAM
      await signInPage.authenticateWithIdamIfAvailable(language);

      // Deceased Task
      await taskListPage.selectATask(language, 'deceasedTask');
      await deceasedDetailsPage.chooseBiLingualGrant(optionNo);
      await deceasedDetailsPage.enterDeceasedDetails('Deceased First Name', 'Deceased Last Name');
      await deceasedDetailsPage.enterDeceasedNameOnWill(language, optionYes);
      await deceasedDetailsPage.enterDobDetails(language, '01', '01', '1950', true);
      await signInPage.seeSignOut(language);

      await signInPage.authenticateWithIdamIfAvailable(language, true);

      // Dashboard
      await taskListPage.chooseApplication(language);

      // Deceased Details
      await basePage.logInfo(scenarioName, "Deceased Details Task", null);
      await taskListPage.selectATask(language, 'deceasedTask');
      await deceasedDetailsPage.enterDobDetails(language, '01', '01', '1950');
      await deceasedDetailsPage.enterDodDetails(
        deceasedDetailsConfig.deceasedDodDay,
        deceasedDetailsConfig.deceasedDodMonth,
        deceasedDetailsConfig.deceasedDodYear
      );
      await deceasedDetailsPage.enterDeceasedAddress();

      await deceasedDetailsPage.selectDiedEngOrWales(optionNo);
      await deceasedDetailsPage.selectEnglishForeignDeathCert(language, optionNo);
      await deceasedDetailsPage.selectForeignDeathCertTranslation(language, optionYes);

      if (testConfigurator.getUseGovPay() === 'true') {
        await deceasedDetailsPage.enterGrossAndNet('205');
        await deceasedDetailsPage.enterProbateAssetValues('300000', '200000');
      } else {
        await deceasedDetailsPage.enterGrossAndNet('205');
        await deceasedDetailsPage.enterProbateAssetValues('500', '400');
      }

      await deceasedDetailsPage.selectDeceasedAliasGop(language, optionNo);
      await deceasedDetailsPage.selectDeceasedMarriedAfterDateOnWill(optionNo)
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

      // ExecutorsTask
      await basePage.logInfo(scenarioName, "Executor details task", null);
      await taskListPage.selectATask(language, 'executorsTask');
      await applicantDetailsPage.enterApplicantName(language, 'Applicant First Name', 'Applicant Last Name');
      await executorDetailsPage.selectNameAsOnTheWill(optionYes);
      await applicantDetailsPage.enterApplicantPhone(language);
      await applicantDetailsPage.enterAddressManually();
      await executorDetailsPage.checkWillCodicils();

      const totalExecutors = '1';
      await executorDetailsPage.enterExecutorNamed(totalExecutors, optionNo);

      if (testConfigurator.equalityAndDiversityEnabled()) {
        await applicantDetailsPage.exitEqualityAndDiversity(language);
        await applicantDetailsPage.completeEqualityAndDiversity(language, false, true);
      }

      // Check your answers and declaration
      await basePage.logInfo(scenarioName, "CYA and Legal Declaration - main executor", null);
      await taskListPage.selectATask(language, 'reviewAndConfirmTask');
      await cyaAndDeclarationPage.seeSummaryPage(language, 'declaration');
      await cyaAndDeclarationPage.acceptDeclaration(language, bilingualGOP);

      // Payment Task
      await basePage.logInfo(scenarioName, "Payment details task", null);
      await taskListPage.selectATask(language, 'paymentTask');

      if (testConfigurator.getUseGovPay() === 'true') {
        await paymentTaskPage.enterUkCopies(language, '5');
        await paymentTaskPage.selectOverseasAssets(optionYes);
        await paymentTaskPage.enterOverseasCopies('2');
      } else {
        await paymentTaskPage.enterUkCopies(language, '0');
        await paymentTaskPage.selectOverseasAssets(optionNo);
      }
      await paymentTaskPage.seeCopiesSummary(language);
      await paymentTaskPage.seePaymentBreakdownPage(language);
      if (testConfigurator.getUseGovPay() === 'true') {
        await paymentTaskPage.seeGovUkPaymentPage(language);
        await paymentTaskPage.seeGovUkConfirmPage(language);
      }

      // Thank You
      const caseId = await paymentTaskPage.seeThankYouPage(language, true);
      await basePage.logInfo(scenarioName, "Application submitted successfully", `${caseId}`);
    });
  });
});
