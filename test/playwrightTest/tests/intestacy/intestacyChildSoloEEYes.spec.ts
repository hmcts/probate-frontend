import { test } from '../../fixtures/index.ts';
import { BasePage, getTestLanguages } from '../../pages/utility/basePage.ts';
import { Page, BrowserContext } from "@playwright/test";
import { TestConfigurator } from "../../pages/utility/testConfigurator.ts";
import ihtDataConfig from "../../data/ee/ihtData.json" with { type: "json" };
import applicantDetailConfig from "../../data/intestacy/sole/applicantDetails.json" with { type: "json" };
import deceasedDetailsConfig from "../../data/deceasedDetailsConfig.json" with { type: "json" };


const optionYes: 'optionYes' = ihtDataConfig.optionYes as 'optionYes';
const optionNo: 'optionNo' = ihtDataConfig.optionNo as 'optionNo';
const maritalStatusMarried = ihtDataConfig.maritalStatusMarried;
const hmrcCode = ihtDataConfig.hmrcCode;
const bilingualGOP = false;

getTestLanguages().forEach(language => {
  test.describe('Intestacy sole child journey - EE Yes ipadpro11', () => {
    test.describe.configure({ mode: 'serial' });

    test.use({ language });
    let testConfigurator: TestConfigurator;
    let context!: BrowserContext;
    let page!: Page;
    let basePage: BasePage;

    test.beforeEach(async () => {
      testConfigurator = new TestConfigurator();
      basePage = new BasePage(page, context, language);
      await testConfigurator.getBefore(); // creates unique user for this language
    });

    test.afterEach(async () => {
      await testConfigurator.getAfter(); // only deletes THIS language's user
    });

    test((`${language.toUpperCase()} Go to application task list page to complete deceased and applicant details`), async ({
      intestacyScreenerPage,
      apiCallback,
      signInPage,
      taskListPage,
      deceasedDetailsPage,
      applicantDetailsPage,
      cyaAndDeclarationPage,
      paymentTaskPage
    }) => {
      const testConfigurator = new TestConfigurator();
      const scenarioName = `Intestacy child solo journey - EE Yes - ${language}`;

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
      await intestacyScreenerPage.selectPersonWhoDiedLeftAWill(language, optionNo);

      // Intestacy Sceeners
      await intestacyScreenerPage.selectDiedAfterOctober2014(optionYes);
      await intestacyScreenerPage.selectRelatedToDeceased(language);
      await intestacyScreenerPage.selectOtherApplicants(language, optionNo);
      await intestacyScreenerPage.startApply(language);

      // IdAM
      await signInPage.authenticateWithIdamIfAvailable(language);

      // Deceased Task
      await basePage.logInfo(scenarioName, "Deceased Details Task", null);
      await taskListPage.selectATask(language, 'deceasedTask');
      await deceasedDetailsPage.chooseBiLingualGrant(optionNo);
      await deceasedDetailsPage.enterDeceasedDetails(
        'Intestacy',
        applicantDetailConfig.deceasedFirstName,
        applicantDetailConfig.deceasedLastName,
        deceasedDetailsConfig.deceasedDobDay,
        deceasedDetailsConfig.deceasedDobMonth,
        deceasedDetailsConfig.deceasedDobYear,
        deceasedDetailsConfig.deceasedDodDay,
        deceasedDetailsConfig.deceasedDodMonth,
        deceasedDetailsConfig.deceasedDodYearEE,
      );
      await deceasedDetailsPage.enterDeceasedAddress();

      await deceasedDetailsPage.selectDiedEngOrWales(optionNo);
      await deceasedDetailsPage.selectEnglishForeignDeathCert(language, optionNo);
      await deceasedDetailsPage.selectForeignDeathCertTranslation(language, optionYes);
      await deceasedDetailsPage.selectEEComplete(optionYes);
      await deceasedDetailsPage.selectSubmittedToHmrc(optionYes);
      await deceasedDetailsPage.selectHmrcLetterComplete(optionYes);
      await deceasedDetailsPage.enterHmrcCode(hmrcCode);
      await deceasedDetailsPage.enterProbateAssetValues('400000', '400000');

      await deceasedDetailsPage.selectAssetsOutsideEnglandWales('optionYes');
      await deceasedDetailsPage.enterValueAssetsOutsideEnglandWales('400000');
      await deceasedDetailsPage.selectDeceasedAlias(language, optionNo);
      await deceasedDetailsPage.selectDeceasedMaritalStatus(maritalStatusMarried);

      // Applicant Task
      await basePage.logInfo(scenarioName, "Applicant details task", null);
      await taskListPage.selectATask(language, 'applicantsTask');
      await applicantDetailsPage.selectRelationshipToDeceased('optionChild');
      await applicantDetailsPage.selectSpouseNotApplyingReason('optionOther');
      await applicantDetailsPage.viewSpouseNotApplyingStopPage(language);
      await applicantDetailsPage.selectSpouseNotApplyingReason('optionRenouncing');
      await applicantDetailsPage.enterAnyOtherChildren('optionYes');
      await applicantDetailsPage.allChildrenOver18('optionYes');
      await applicantDetailsPage.anyDeceasedChildren('optionYes');
      await applicantDetailsPage.anyGrandchildrenUnder18('optionNo');
      await applicantDetailsPage.enterApplicantName(language, 'ApplicantFirstName', 'ApplicantLastName');
      await applicantDetailsPage.enterApplicantPhone(language);
      await applicantDetailsPage.enterAddressManually();
      await applicantDetailsPage.skipEqualityAndDiversityQuestions();

      // Check your answers and declaration
      await basePage.logInfo(scenarioName, "CYA and Legal Declaration - main applicant", null);
      await taskListPage.selectCheckYourAnswersAndDeclaration(language);
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
        await paymentTaskPage.seeGovUkPaymentPage();
        await paymentTaskPage.seeGovUkConfirmPage();
      }

      // Thank You
      const caseId = await paymentTaskPage.seeThankYouPage(language);
      await basePage.logInfo(scenarioName, "Application submitted successfully", `${caseId}`);
    });
  });
});
