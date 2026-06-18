import { test } from '../../fixtures/index.ts';
import { getTestLanguages } from '../../pages/utility/basePage.ts';

import { TestConfigurator } from "../../pages/utility/testConfigurator.ts";
import ihtDataConfig from "../../data/ee/ihtData.json" with { type: "json" };
import applicantDetailConfig from "../../data/intestacy/sole/applicantDetails.json" with { type: "json" };
import deceasedDetailsConfig from "../../data/deceasedDetailsConfig.json" with { type: "json" };

const optionYes = ihtDataConfig.optionYes;
const optionNo = ihtDataConfig.optionNo;
const bilingualGOP = false;

getTestLanguages().forEach(language => {
  test.describe('Intestacy parent joint application journey - IHT 205', () => {
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
      coApplicantNotifyAndDeclarationPage,
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
      await intestacyScreenerPage.selectDiedAfterOctober2014(optionYes);
      await intestacyScreenerPage.selectRelatedToDeceased(language, applicantDetailConfig.relationshipParentOfDeceased);

      await intestacyScreenerPage.startApply(language);

      // IdAM
      await signInPage.authenticateWithIdamIfAvailable(language);

      // Deceased Task
      await taskListPage.selectATask(language, 'deceasedTask');
      await deceasedDetailsPage.chooseBiLingualGrant(optionNo);
      await deceasedDetailsPage.enterDeceasedDetails('Deceased First Name', 'Deceased Last Name');
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

      await deceasedDetailsPage.selectAssetsOutsideEnglandWales(language, optionYes);
      await deceasedDetailsPage.enterValueAssetsOutsideEnglandWales('400000');

      await deceasedDetailsPage.selectDeceasedAlias(language, optionNo);

      await deceasedDetailsPage.selectDeceasedMaritalStatus(applicantDetailConfig.maritalStatusDivorced);
      await deceasedDetailsPage.selectDivorcePlace(language, optionYes);
      await deceasedDetailsPage.enterDivorceDate(language, optionYes, '01', '01', '2015');

      // Applicant Task
      await taskListPage.selectATask(language, 'applicantsTask');
      await applicantDetailsPage.selectRelationshipToDeceased(language, applicantDetailConfig.relationshipParentOfDeceased);
      await applicantDetailsPage.selectAnyLivingDescendants(optionNo);

      await applicantDetailsPage.deceasedAdoptedIn(language, optionYes, 'parent');
      await applicantDetailsPage.deceasedAdoptionPlace(language, optionYes);

      await applicantDetailsPage.deceasedOtherParentAlive(language, optionYes);
      await applicantDetailsPage.enterApplicantName(language, 'ApplicantFirstName', 'ApplicantLastName');
      await applicantDetailsPage.enterApplicantPhone(language);
      await applicantDetailsPage.enterAddressManually();

      //First co-applicant - parent
      const coApplicantNumber = "1";
      await applicantDetailsPage.jointApplication(language, optionYes, 'Parent');
      await applicantDetailsPage.enterCoapplicantName(coApplicantNumber, applicantDetailConfig.firstCoApplicantName);
      await applicantDetailsPage.enterCoApplicantEmail(coApplicantNumber, applicantDetailConfig.firstCoApplicantEmail);
      await applicantDetailsPage.enterCoApplicantAddress(coApplicantNumber);

      if (testConfigurator.equalityAndDiversityEnabled()) {
        await applicantDetailsPage.exitEqualityAndDiversity(language);
        await applicantDetailsPage.completeEqualityAndDiversity(language);
      }

      // Check your answers and declaration
      await taskListPage.selectATask(language, 'reviewAndConfirmTask');
      await cyaAndDeclarationPage.seeSummaryPage(language, 'declaration');
      await cyaAndDeclarationPage.acceptDeclaration(language, bilingualGOP);

      // Notify additional executors Dealing with estate
      await coApplicantNotifyAndDeclarationPage.notifyAdditionalExecutors(language, 'intestacyQuestion');
      await coApplicantNotifyAndDeclarationPage.notificationSent(language);

      //Retrieve the email urls for additional executors
      const grabIds = await coApplicantNotifyAndDeclarationPage.getIdList();

      let idList = null;
      try {
        idList = JSON.parse(grabIds);
      } catch (err) {
        console.error(err.message);
      }
      console.log('idList:', idList);

      for (let i = 0; i < idList.ids.length; i++) {
        await coApplicantNotifyAndDeclarationPage.seeCoApplicantStartPage(language, idList.ids[i]);
        await coApplicantNotifyAndDeclarationPage.coApplicantDeclarationPage2(
          deceasedDetailsConfig.deceasedDodDay,
          deceasedDetailsConfig.deceasedDodMonth,
          deceasedDetailsConfig.deceasedDodYear
        );
        await coApplicantNotifyAndDeclarationPage.agreeDeclaration(optionYes);
        await coApplicantNotifyAndDeclarationPage.seeAgreePage(language, 'intestacy');
      }

      // IDAM
      await signInPage.authenticateWithIdamIfAvailable(language, true);

      // Dashboard
      await taskListPage.chooseApplication(language);

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
