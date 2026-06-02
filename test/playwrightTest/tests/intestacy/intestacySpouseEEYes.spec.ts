import { test } from '../../fixtures';
import { BasePage, getTestLanguages } from '../../pages/utility/basePage.ts';
import { ROUTES } from '../../pageUrl/routes.ts';

import taskListContentEn from "../../../../app/resources/en/translation/tasklist.json";
import taskListContentCy from "../../../../app/resources/cy/translation/tasklist.json";
// import {getTestLanguages} from "../../helpers/GeneralHelpers.json" with { type: "json" };
import { TestConfigurator } from "../../pages/utility/testConfigurator.ts";
import ihtDataConfig from "../../data/ee/ihtData.json";
import applicantDetailConfig from "../../data/intestacy/sole/applicantDetails.json"

const optionYes = ihtDataConfig.optionYes;
const optionNo = ihtDataConfig.optionNo;
const maritalStatusMarried = ihtDataConfig.maritalStatusMarried;
const spouseOfDeceased = applicantDetailConfig.spouseOfDeceased;
const optionRenouncing = applicantDetailConfig.optionRenouncing;
const bilingualGOP = false;
const hmrcCode = ihtDataConfig.hmrcCode;

// let testConfigurator: TestConfigurator;
// testConfigurator = new TestConfigurator();
//
// test.beforeEach(async () => {
//   //***Need to migrate code for launch darkly to playwright typescript and enable this line ****//
//   // await TestConfigurator.initLaunchDarkly();
//   await testConfigurator.getBefore();
// });
//
// test.afterEach(async () => {
//   await testConfigurator.getAfter();
// });

getTestLanguages().forEach(language => {
  test.describe('Intestacy sole child journey', () => {
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

    test((`${language.toUpperCase()} Go to death-certificate page and complete deceased details`), async ({
      page,
      intestacyScreenerPage,
      apiCallback,
      signInPage,
      taskListPage,
      deceasedDetailsPage,
      applicantDetailsPage
    }) => {
      const testConfigurator = new TestConfigurator();
      const taskListContent = language === 'en' ? taskListContentEn : taskListContentCy;

      await apiCallback.createAUser(testConfigurator);

      // Eligibility Task (pre IdAM)
      await intestacyScreenerPage.startApplication(language);

      // await I.startApplication(language);

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
      await intestacyScreenerPage.selectRelatedToDeceased(language, spouseOfDeceased);

      await intestacyScreenerPage.startApply(language);

      // IdAM
      await signInPage.authenticateWithIdamIfAvailable(language);

      // Deceased Task
      await taskListPage.selectATask(language, 'deceasedTask');
      await deceasedDetailsPage.chooseBiLingualGrant(optionNo);
      await deceasedDetailsPage.enterDeceasedDetails('Deceased First Name', 'Deceased Last Name');
      await deceasedDetailsPage.enterDobDetails('01', '01', '1950');
      await deceasedDetailsPage.enterDodDetails('02', '01', '2022');
      await deceasedDetailsPage.enterDeceasedAddress();

      await deceasedDetailsPage.selectDiedEngOrWales(optionNo);
      await deceasedDetailsPage.selectEnglishForeignDeathCert(language, optionNo);
      await deceasedDetailsPage.selectForeignDeathCertTranslation(language, optionYes);

      await deceasedDetailsPage.selectEEComplete(optionYes);
      await deceasedDetailsPage.selectSubmittedToHmrc(optionYes);
      await deceasedDetailsPage.selectHmrcLetterComplete(optionYes);
      await deceasedDetailsPage.enterHmrcCode(hmrcCode);
      await deceasedDetailsPage.enterProbateAssetValues('400000', '400000');

      await deceasedDetailsPage.selectAssetsOutsideEnglandWales(language, optionYes);
      await deceasedDetailsPage.enterValueAssetsOutsideEnglandWales('400000');
      await deceasedDetailsPage.selectDeceasedAlias(language, optionNo);
      await deceasedDetailsPage.selectDeceasedMaritalStatus(maritalStatusMarried);

      // Applicant Task
      await taskListPage.selectATask(language, 'applicantsTask');
      await applicantDetailsPage.selectRelationshipToDeceased(language, spouseOfDeceased);
      await applicantDetailsPage.enterAnyChildren(language, optionYes);
      await applicantDetailsPage.anyChildrenOverEighteen(language, optionYes);
      await applicantDetailsPage.otherChildrenDiedBefore(applicantDetailConfig.optionSomeOfThem);
      await applicantDetailsPage.anyGrandChildren(language, optionYes);
      await applicantDetailsPage.anyGrandchildrenUnderEighteen(language, optionNo);
      await applicantDetailsPage.jointApplication(optionYes);
      await applicantDetailsPage.spouseCoApplicationStopPage();
      await applicantDetailsPage.jointApplication(optionNo);
      await applicantDetailsPage.enterApplicantName(language, 'ApplicantFirstName', 'ApplicantLastName');
      await applicantDetailsPage.enterApplicantPhone(language);
      await applicantDetailsPage.enterAddressManually();
      if (testConfigurator.equalityAndDiversityEnabled()) {
        await applicantDetailsPage.exitEqualityAndDiversity(language);
        await applicantDetailsPage.completeEqualityAndDiversity();
      }

      await taskListPage.clickGiveDetailsAboutThePeopleApplying();
      await relationshipToDeceasedPage.selectChild();
      await spouseNotApplyingReasonPage.selectGivingUpRightToApply();
      await mainApplicantAdoptedInPage.selectYes();
      await adoptedInEnglandOrWalesPage.selectYes(ROUTES.intestacyAnyOtherChildren);
      await anyOtherChildrenPage.selectYes();
      await anyPredeceasedChildrenPage.selectYesSome();
      await anySurvivingGrandchildrenPage.selectYes();
      await anyGrandchildrenUnder18Page.selectNo();
      await allChildrenOver18Page.selectYes();
      await applicantNamePage.enterApplicantName(
        soleChildApplicant.firstName,
        soleChildApplicant.lastName,
      );
      await applicantPhonePage.enterApplicantPhoneNumber(
        soleChildApplicant.phoneNumber,
      );
      await mainApplicantAddressPage.enterManualAddressAndContinue(
        soleChildApplicant.address.line1,
        soleChildApplicant.address.line2,
        soleChildApplicant.address.line3,
        soleChildApplicant.address.town,
        soleChildApplicant.address.postcode,
        soleChildApplicant.address.country,
      );

      await jointApplicationPage.selectNo();
      await equalityAndDiversityPage.optOut();
      await taskListPage.goToDeclaration();
      await summaryDeclarationPage.continueToDeclaration();
      await declarationPage.confirmDeclarationAndContinue(ROUTES.taskList);
      await taskListPage.goToPayAndSubmit();
      await copiesUkPage.enterExtraOfficialCopiesAndContinue('1');
      await assetsOverseasPage.selectYes();
      await copiesOverseasPage.enterExtraCertifiedCopiesAndContinue('1');
      await copiesSummaryPage.saveAndContinue();
      await paymentBreakdownPage.payAndSubmitApplication();
      await cardDetailsPage.fillCardDetailsAndContinue(paymentDetails);
      await cardConfirmPage.confirmPayment();
      await thankYouPage.expectApplicationSubmitted();


      const caseId = await thankYouPage.getCaseId();
      console.log(`Case ID: ${caseId}`);
    });
  });
});
