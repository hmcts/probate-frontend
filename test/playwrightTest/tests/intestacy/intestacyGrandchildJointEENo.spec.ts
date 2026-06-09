import { test } from '../../fixtures';
import { getTestLanguages } from '../../pages/utility/basePage.ts';

import { TestConfigurator } from "../../pages/utility/testConfigurator.ts";
import ihtDataConfig from "../../data/ee/ihtData.json";
import applicantDetailConfig from "../../data/intestacy/sole/applicantDetails.json"
import deceasedDetailsConfig from "../../data/deceasedDetailsConfig.json";

const optionYes = ihtDataConfig.optionYes;
const optionNo = ihtDataConfig.optionNo;
const maritalStatusMarried = ihtDataConfig.maritalStatusMarried;
const relationshipGrandchildOfDeceased = applicantDetailConfig.relationshipGrandchildOfDeceased;
const optionRenouncing = applicantDetailConfig.optionRenouncing;
const bilingualGOP = false;

getTestLanguages().forEach(language => {
  test.describe('Intestacy Grandchild joint application journey - EE No', () => {
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
      await intestacyScreenerPage.selectDiedAfterOctober2014(language, optionYes);
      await intestacyScreenerPage.selectRelatedToDeceased(language, relationshipGrandchildOfDeceased);

      await intestacyScreenerPage.startApply(language);

      // IdAM
      await signInPage.authenticateWithIdamIfAvailable(language);

      // Deceased Task
      await taskListPage.selectATask(language, 'deceasedTask');
      await deceasedDetailsPage.chooseBiLingualGrant(optionNo);
      await deceasedDetailsPage.enterDeceasedDetails('Deceased First Name', 'Deceased Last Name');
      await deceasedDetailsPage.enterDobDetails('01', '01', '1950');
      await deceasedDetailsPage.enterDodDetails(
        deceasedDetailsConfig.deceasedDodDay,
        deceasedDetailsConfig.deceasedDodMonth,
        deceasedDetailsConfig.deceasedDodYearEE);
      await deceasedDetailsPage.enterDeceasedAddress();

      await deceasedDetailsPage.selectDiedEngOrWales(optionYes);
      await deceasedDetailsPage.selectDeathCertificateType(language, optionYes)
      // await deceasedDetailsPage.selectEnglishForeignDeathCert(language, optionNo);
      // await deceasedDetailsPage.selectForeignDeathCertTranslation(language, optionYes);

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
      await taskListPage.selectATask(language, 'applicantsTask');
      await applicantDetailsPage.selectRelationshipToDeceased(language, relationshipGrandchildOfDeceased);
      await applicantDetailsPage.selectSpouseNotApplyingReason(optionRenouncing);
      await applicantDetailsPage.selectMainApplicantParentAlive(optionNo);
      await applicantDetailsPage.mainApplicantParentAdoptedIn(language, optionYes);
      await applicantDetailsPage.mainApplicantParentAdoptionPlace(language, optionYes);

      await applicantDetailsPage.mainApplicantAdoptedIn(language, optionYes, 'grandchild');
      await applicantDetailsPage.mainApplicantAdoptionPlace(language, optionYes);

      await applicantDetailsPage.enterAnyOtherChildren(language, optionYes);
      await applicantDetailsPage.otherChildrenDiedBefore(applicantDetailConfig.optionSomeOfThem);
      await applicantDetailsPage.anyGrandChildren(language, optionYes);
      await applicantDetailsPage.anyGrandchildrenUnderEighteen(language, optionNo);
      await applicantDetailsPage.anyChildrenOverEighteen(language, optionYes);
      await applicantDetailsPage.mainApplicantParentAnyOtherChildren(optionYes);
      await applicantDetailsPage.allGrandchildrenOverEighteen(optionYes);

      await applicantDetailsPage.enterApplicantName(language, 'ApplicantFirstName', 'ApplicantLastName');
      await applicantDetailsPage.enterApplicantPhone(language);
      await applicantDetailsPage.enterAddressManually();

      //First co-applicant - child
      let coApplicantNumber = "1";
      await applicantDetailsPage.jointApplication(language, optionYes);
      await applicantDetailsPage.selectCoapplicantRelationship(applicantDetailConfig.coapplicantChild, coApplicantNumber);
      await applicantDetailsPage.enterCoapplicantName(coApplicantNumber, applicantDetailConfig.firstCoApplicantName);
      await applicantDetailsPage.coApplicantAdoptedIn(coApplicantNumber, optionNo);
      await applicantDetailsPage.coApplicantAdoptedOut(coApplicantNumber, optionNo);
      await applicantDetailsPage.enterCoApplicantEmail(coApplicantNumber, applicantDetailConfig.firstCoApplicantEmail);
      await applicantDetailsPage.enterCoApplicantAddress(coApplicantNumber);

      //Second co-applicant - grandchild
      coApplicantNumber = "2";
      await applicantDetailsPage.jointApplication(language, optionYes);
      await applicantDetailsPage.selectCoapplicantRelationship(applicantDetailConfig.coapplicantGrandchild, coApplicantNumber);
      await applicantDetailsPage.selectCoApplicantParentAlive(coApplicantNumber, optionYes);
      await applicantDetailsPage.enterCoapplicantName(coApplicantNumber, applicantDetailConfig.secondCoApplicantName);
      await applicantDetailsPage.coApplicantAdoptedIn(coApplicantNumber, optionNo);
      await applicantDetailsPage.coApplicantAdoptedOut(coApplicantNumber, optionNo);

      await applicantDetailsPage.coApplicantParentAdoptedIn(coApplicantNumber, optionYes);
      await applicantDetailsPage.coApplicantParentAdoptionPlace(coApplicantNumber, optionYes);

      await applicantDetailsPage.enterCoApplicantEmail(coApplicantNumber, applicantDetailConfig.secondCoApplicantEmail);
      await applicantDetailsPage.enterCoApplicantAddress(coApplicantNumber);

      //Third co-applicant - child
      coApplicantNumber = "3";
      await applicantDetailsPage.jointApplication(language, optionYes);
      await applicantDetailsPage.selectCoapplicantRelationship(applicantDetailConfig.coapplicantChild, coApplicantNumber);
      await applicantDetailsPage.enterCoapplicantName(coApplicantNumber, applicantDetailConfig.thirdCoApplicantName);
      await applicantDetailsPage.coApplicantAdoptedIn(coApplicantNumber, optionYes);
      await applicantDetailsPage.coApplicantAdoptionPlace(coApplicantNumber, optionYes);
      await applicantDetailsPage.enterCoApplicantEmail(coApplicantNumber, applicantDetailConfig.thirdCoApplicantEmail);
      await applicantDetailsPage.enterCoApplicantAddress(coApplicantNumber);

      await applicantDetailsPage.jointApplication(language, optionNo);

      if (testConfigurator.equalityAndDiversityEnabled()) {
        await applicantDetailsPage.exitEqualityAndDiversity(language);
        await applicantDetailsPage.completeEqualityAndDiversity(language, true);
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
          deceasedDetailsConfig.deceasedDodYearEE
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
