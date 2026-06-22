import { test } from '../../../fixtures/index.ts';
import { BasePage, getTestLanguages } from '../../../pages/utility/basePage.ts';

import { TestConfigurator } from "../../../pages/utility/testConfigurator.ts";
import ihtDataConfig from "../../../data/ee/ihtData.json" with { type: "json" };
import applicantDetailConfig from "../../../data/intestacy/sole/applicantDetails.json" with { type: "json" };

const optionYes = ihtDataConfig.optionYes;
const optionNo = ihtDataConfig.optionNo;
const maritalStatusMarried = ihtDataConfig.maritalStatusMarried;
const relationshipGrandchildOfDeceased = applicantDetailConfig.relationshipGrandchildOfDeceased;
const optionRenouncing = applicantDetailConfig.optionRenouncing;
const bilingualGOP = false;

getTestLanguages().forEach(language => {
  test.describe('Intestacy sole Grandchild journey - EE No', () => {
    test.describe.configure({ mode: 'serial' });

    test.use({ language });
    let testConfigurator: TestConfigurator;
    let basePage: BasePage;

    test.beforeEach(async () => {
      testConfigurator = new TestConfigurator();
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
      const scenarioName = `Intestacy grandchild solo journey - EE No - ${language}`;

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
      await intestacyScreenerPage.selectRelatedToDeceased(language, relationshipGrandchildOfDeceased);

      await intestacyScreenerPage.startApply(language);

      // IdAM
      await signInPage.authenticateWithIdamIfAvailable(language);

      // Deceased Task
      await basePage.logInfo(scenarioName, "Deceased Details Task", null);
      await taskListPage.selectATask(language, 'deceasedTask');
      await deceasedDetailsPage.chooseBiLingualGrant(optionNo);
      await deceasedDetailsPage.enterDeceasedDetails('Deceased First Name', 'Deceased Last Name');
      await deceasedDetailsPage.enterDobDetails(language, '01', '01', '1950');
      await deceasedDetailsPage.enterDodDetails('02', '01', '2022');
      await deceasedDetailsPage.enterDeceasedAddress();

      await deceasedDetailsPage.selectDiedEngOrWales(optionNo);
      await deceasedDetailsPage.selectEnglishForeignDeathCert(language, optionNo);
      await deceasedDetailsPage.selectForeignDeathCertTranslation(language, optionYes);

      await deceasedDetailsPage.selectEEComplete(optionYes);
      await deceasedDetailsPage.selectSubmittedToHmrc(optionNo);
      await deceasedDetailsPage.enterEEValue('500000', '400000', '400000');
      await deceasedDetailsPage.selectLateSpouseCivilPartner(optionYes);
      await deceasedDetailsPage.selectUnusedAllowance(optionYes);
      await deceasedDetailsPage.enterProbateAssetValues('400000', '400000');

      await deceasedDetailsPage.selectAssetsOutsideEnglandWales(language, optionYes);
      await deceasedDetailsPage.enterValueAssetsOutsideEnglandWales('400000');


      await deceasedDetailsPage.selectDeceasedAlias(language, optionNo);
      await deceasedDetailsPage.selectDeceasedMaritalStatus(maritalStatusMarried);

      // Applicant Task
      await basePage.logInfo(scenarioName, "Applicant details task", null);
      await taskListPage.selectATask(language, 'applicantsTask');
      await applicantDetailsPage.selectRelationshipToDeceased(language, relationshipGrandchildOfDeceased);
      await applicantDetailsPage.selectSpouseNotApplyingReason(optionRenouncing);
      await applicantDetailsPage.selectMainApplicantParentAlive(optionNo);
      await applicantDetailsPage.mainApplicantParentAdoptedIn(language, optionNo);
      await applicantDetailsPage.mainApplicantParentAdoptedOut(language, optionYes);
      await applicantDetailsPage.applicantParentAdoptedOutStopPage(language);
      await applicantDetailsPage.mainApplicantParentAdoptedOut(language, optionNo);

      await applicantDetailsPage.mainApplicantAdoptedIn(language, optionYes, 'grandchild');
      await applicantDetailsPage.mainApplicantAdoptionPlace(language, optionYes);

      await applicantDetailsPage.enterAnyOtherChildren(language, optionYes);
      await applicantDetailsPage.otherChildrenDiedBefore(applicantDetailConfig.optionAllOfThem);
      await applicantDetailsPage.anyGrandChildren(language, optionNo);
      await applicantDetailsPage.mainApplicantParentAnyOtherChildren(optionNo);

      await applicantDetailsPage.enterApplicantName(language, 'ApplicantFirstName', 'ApplicantLastName');
      await applicantDetailsPage.enterApplicantPhone(language);
      await applicantDetailsPage.enterAddressManually();

      if (testConfigurator.equalityAndDiversityEnabled()) {
        await applicantDetailsPage.exitEqualityAndDiversity(language);
        await applicantDetailsPage.completeEqualityAndDiversity(language);
      }

      // Check your answers and declaration
      await basePage.logInfo(scenarioName, "CYA and Legal Declaration - main applicant", null);
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
      const caseId = await paymentTaskPage.seeThankYouPage(language);
      await basePage.logInfo(scenarioName, "Application submitted successfully", `${caseId}`);
    });
  });
});
