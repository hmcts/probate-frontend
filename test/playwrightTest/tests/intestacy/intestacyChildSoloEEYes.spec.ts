import { test } from '../../fixtures';
//import { BasePage, getTestLanguages } from '../../pages/utility/basePage.ts';
import { getTestLanguages } from '../../pages/utility/basePage.ts';
import { ROUTES } from '../../pageUrl/routes.ts';

import taskListContentEn from "../../../../app/resources/en/translation/tasklist.json";
import taskListContentCy from "../../../../app/resources/cy/translation/tasklist.json";
//import {getTestLanguages} from "../../helpers/GeneralHelpers.json" with { type: "json" };
import { TestConfigurator } from "../../pages/utility/testConfigurator.ts";
import ihtDataConfig from "../../data/ee/ihtData.json";


const optionYes = ihtDataConfig.optionYes;
const optionNo = ihtDataConfig.optionNo;
const relationshipChildOfDeceased = ihtDataConfig.relationshipChildOfDeceased;
const maritalStatusMarried = ihtDataConfig.maritalStatusMarried;
const spouseOfDeceased = ihtDataConfig.spouseOfDeceased;
const optionRenouncing = ihtDataConfig.optionRenouncing;
const bilingualGOP = false;
const hmrcCode = ihtDataConfig.hmrcCode;


let testConfigurator: TestConfigurator;
testConfigurator = new TestConfigurator();

test.beforeEach(async () => {
  //***Need to migrate code for launch darkly to playwright typescript and enable this line ****//
  // await TestConfigurator.initLaunchDarkly();
  await testConfigurator.getBefore();
});

test.afterEach(async () => {
  await testConfigurator.getAfter();
});

getTestLanguages().forEach(language => {
  test.describe('Intestacy sole child journey', () => {
    test.use({ language });
    test(testConfigurator.idamInUseText(`${language.toUpperCase()} Go to death-certificate page and complete deceased details`), async ({
          page,
          intestacyScreenerPage,
          apiCallback,
          signInPage,
          taskListPage,
          bilingualGopPage,
          deceasedDetailsPage,
          applicantsPage,
          equalityAndDiversityPage,
          declarationPage,
        }) => {
      /*await intestacyScreenerPage.selectYes();
      await page.goto('/death-certificate');
      await deathCertificatePage.selectYes();
      await deathCertificateEnglishPage.selectYes();
      await deceasedDomicilePage.selectYes();
      await eeDeceasedDodPage.selectYes();
      await eeEstateValuedPage.selectYes();
      await willLeftPage.selectNo();
      await relatedToDeceasedPage.selectChild();*/
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
      await intestacyScreenerPage.selectRelatedToDeceased(language, relationshipChildOfDeceased);

      await intestacyScreenerPage.startApply(language);

      // IdAM
      await signInPage.authenticateWithIdamIfAvailable(language);

      // Deceased Task
      await taskListPage.selectATask(language, 'deceasedTask');
      await bilingualGopPage.selectBilingualGrant(optionNo);
      await deceasedDetailsPage.enterDeceasedDetails(
      'Deceased First Name',
      'Deceased Last Name',
      '01',
      '01',
      '1950',
      '02',
      '01',
      '2022',
    );

    await deceasedDetailsPage.enterDeceasedAddress(
        'Deceased Address Line 1',
        'Deceased Address Line 2',
        'Deceased Address Line 3',
        'Deceased Town',
        'Deceased Postcode',
        'Deceased Country',
      );

      await deceasedDetailsPage.selectDiedEngOrWales(optionNo);
      await deceasedDetailsPage.selectEnglishForeignDeathCert(optionNo);
      await deceasedDetailsPage.selectForeignDeathCertTranslation(optionYes);

      await deceasedDetailsPage.selectEEComplete(optionYes);
      await deceasedDetailsPage.selectSubmittedToHmrc(optionYes);
      await deceasedDetailsPage.selectHmrcLetterComplete(optionYes);
      await deceasedDetailsPage.enterHmrcCode(hmrcCode);
      await deceasedDetailsPage.enterProbateAssetValues('400000', '400000');

      await deceasedDetailsPage.selectAssetsOutsideEnglandWales(optionYes);
      await deceasedDetailsPage.enterValueAssetsOutsideEnglandWales('400000');
      await deceasedDetailsPage.selectDeceasedAlias(optionNo);
      await deceasedDetailsPage.selectDeceasedMaritalStatus(maritalStatusMarried);

      // Executors Task
      await taskListPage.selectATask(language, 'applicantsTask', taskListContent.taskNotStarted);
      await applicantsPage.selectRelationshipToDeceased(relationshipChildOfDeceased);
      await applicantsPage.selectSpouseNotApplyingReason(optionRenouncing);
      await applicantsPage.enterAnyOtherChildren(optionNo);
      await applicantsPage.enterApplicantName('ApplicantFirstName', 'ApplicantLastName');
      await applicantsPage.enterApplicantPhone('07123456789');
      await applicantsPage.enterApplicantAddress(
  '10 High Street',
  'Flat 2',
  'West End',
  'London',
  'SW1A 1AA',
  'United Kingdom'
);

if (testConfigurator.equalityAndDiversityEnabled()) {
  await equalityAndDiversityPage.exitEqualityAndDiversity();
  await equalityAndDiversityPage.completeEqualityAndDiversity();
}

      // Check your answers and declaration
      await taskListPage.selectTask('reviewAndConfirmTask', taskListContent.taskNotStarted);
      await taskListPage.seeSummaryPage('declaration');
      await declarationPage.acceptDeclaration(language, bilingualGOP);

        // Payment Task
        // await I.selectATask(language, 'paymentTask', taskListContent.taskNotStarted);
        // if (TestConfigurator.getUseGovPay() === 'true') {
        //     await I.enterUkCopies(language, '5');
        //     await I.selectOverseasAssets(language, optionNo);
        // } else {
        //     await I.enterUkCopies(language, '0');
        //     await I.selectOverseasAssets(language, optionNo);

        // }
        // await I.seeCopiesSummary(language);
        // await I.seePaymentBreakdownPage(language);
        // if (TestConfigurator.getUseGovPay() === 'true') {
        //     await I.seeGovUkPaymentPage(language);
        //     await I.seeGovUkConfirmPage(language);
        // }

        // Thank You
    //     await I.seeThankYouPage(language);
    // }).tag('@e2enightly')
    //     .tag('@e2enightly-pr')
    //     .retry(TestConfigurator.getRetryScenarios());




      // const caseId = await thankYouPage.getCaseId();
      // console.log(`Case ID: ${caseId}`);
    });
  });
});
