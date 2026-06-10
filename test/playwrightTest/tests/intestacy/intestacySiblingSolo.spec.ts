import { test } from '../../fixtures';
import { getTestLanguages } from '../../pages/utility/basePage.ts';

import { TestConfigurator } from "../../pages/utility/testConfigurator.ts";
import ihtDataConfig from "../../data/ee/ihtData.json";
import applicantDetailConfig from "../../data/intestacy/sole/applicantDetails.json";

const optionYes = ihtDataConfig.optionYes;
const optionNo = ihtDataConfig.optionNo;
const bilingualGOP = false;
const hmrcCode = ihtDataConfig.hmrcCode;

getTestLanguages().forEach(language => {
  test.describe('Intestacy sole sibling journey - IHT 400', () => {
    test.describe.configure({ mode: 'serial' });

    test.use({ language });
    let testConfigurator: TestConfigurator;

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

      await apiCallback.createAUser(testConfigurator);

      // Eligibility Task (pre IdAM)
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
      await intestacyScreenerPage.selectDiedAfterOctober2014(language, optionYes);
      await intestacyScreenerPage.selectRelatedToDeceased(language, applicantDetailConfig.relationshipSiblingOfDeceased);

      await intestacyScreenerPage.startApply(language);

      // IdAM
      await signInPage.authenticateWithIdamIfAvailable(language);

      // Deceased Task
      await taskListPage.selectATask(language, 'deceasedTask');
      await deceasedDetailsPage.chooseBiLingualGrant(optionNo);
      await deceasedDetailsPage.enterDeceasedDetails('Deceased First Name', 'Deceased Last Name');
      await deceasedDetailsPage.enterDobDetails('01', '01', '1950');
      await deceasedDetailsPage.enterDodDetails('02', '01', '2017');
      await deceasedDetailsPage.enterDeceasedAddress();

      await deceasedDetailsPage.selectDiedEngOrWales(optionNo);
      await deceasedDetailsPage.selectEnglishForeignDeathCert(language, optionNo);
      await deceasedDetailsPage.selectForeignDeathCertTranslation(language, optionYes);

      if (testConfigurator.getUseGovPay() === 'true') {
        await deceasedDetailsPage.enterGrossAndNet('400');
        await deceasedDetailsPage.selectHmrcLetterComplete(optionYes);
        await deceasedDetailsPage.enterHmrcCode(hmrcCode);
        await deceasedDetailsPage.enterProbateAssetValues('300000', '200000');
      } else {
        await deceasedDetailsPage.enterGrossAndNet('400');
         await deceasedDetailsPage.selectHmrcLetterComplete(optionYes);
        await deceasedDetailsPage.enterHmrcCode(hmrcCode);
        await deceasedDetailsPage.enterProbateAssetValues('500', '400');
      }

      await deceasedDetailsPage.selectAssetsOutsideEnglandWales(language, optionYes);
      await deceasedDetailsPage.enterValueAssetsOutsideEnglandWales('400000');

      await deceasedDetailsPage.selectDeceasedAlias(language, optionNo);
      await deceasedDetailsPage.selectDeceasedMaritalStatus(applicantDetailConfig.maritalStatusNotMarried);

      // Applicant Task
      await taskListPage.selectATask(language, 'applicantsTask');
      await applicantDetailsPage.selectRelationshipToDeceased(language, applicantDetailConfig.relationshipSiblingOfDeceased);
      await applicantDetailsPage.selectAnyLivingDescendants(optionNo);
      await applicantDetailsPage.selectAnyLivingParents(language, optionNo);

      await applicantDetailsPage.deceasedAdoptedIn(language, optionYes, 'sibling');
      await applicantDetailsPage.deceasedAdoptionPlace(language, optionYes);

      await applicantDetailsPage.selectDeceasedSameParents(language, applicantDetailConfig.differentParents);
      await applicantDetailsPage.differentParentsStopPage(language);
      await applicantDetailsPage.selectDeceasedSameParents(language, applicantDetailConfig.wholeBloodSiblingsOption);

      await applicantDetailsPage.mainApplicantAdoptedIn(language, optionNo, 'wholeBloodSibling');
      await applicantDetailsPage.mainApplicantAdoptedOut(language, optionNo, 'wholeBloodSibling');

      await applicantDetailsPage.anyOtherWholeSiblings(language, optionYes);
      await applicantDetailsPage.anyPredeceasedSiblings(language, applicantDetailConfig.optionSomeOfThem, 'whole');
      await applicantDetailsPage.anySurvivingNieceNephew(language, optionNo, 'whole');
      await applicantDetailsPage.anySiblingsAbove18(language, optionNo, 'whole');
      await applicantDetailsPage.nieceOrNephewUnder18StopPage(language);
      await applicantDetailsPage.anySiblingsAbove18(language, optionYes, 'whole');

      await applicantDetailsPage.enterApplicantName(language, 'ApplicantFirstName', 'ApplicantLastName');
      await applicantDetailsPage.enterApplicantPhone(language);
      await applicantDetailsPage.enterAddressManually();

      await applicantDetailsPage.jointApplication(language, optionNo);

      if (testConfigurator.equalityAndDiversityEnabled()) {
        await applicantDetailsPage.exitEqualityAndDiversity(language);
        await applicantDetailsPage.completeEqualityAndDiversity(language, true);
      }

      // Check your answers and declaration
      await taskListPage.selectATask(language, 'reviewAndConfirmTask');
      await cyaAndDeclarationPage.seeSummaryPage(language, 'declaration');
      await cyaAndDeclarationPage.acceptDeclaration(language, bilingualGOP);

      // Payment Task
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

      console.log(`Case ID: ${caseId}`);
    });
  });
});
