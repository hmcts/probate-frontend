import { test } from '../../fixtures';
import { BasePage, getTestLanguages } from '../../pages/utility/basePage.ts';
import { ROUTES } from '../../pageUrl/routes.ts';

import taskListContentEn from "../../../../app/resources/en/translation/tasklist.json";
import taskListContentCy from "../../../../app/resources/cy/translation/tasklist.json";
// import {getTestLanguages} from "../../helpers/GeneralHelpers.json" with { type: "json" };
import { TestConfigurator } from "../../pages/utility/testConfigurator.ts";
import ihtDataConfig from "../../data/ee/ihtData.json";

const optionYes = ihtDataConfig.optionYes;
const optionNo = ihtDataConfig.optionNo;
const maritalStatusMarried = ihtDataConfig.maritalStatusMarried;
const spouseOfDeceased = ihtDataConfig.spouseOfDeceased;
const relationshipChildOfDeceased = ihtDataConfig.relationshipChildOfDeceased;
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
      await I.chooseBiLingualGrant(language, optionNo);
      await I.enterDeceasedDetails(language, 'Deceased First Name', 'Deceased Last Name', '01', '01', '1950', '02', '01', '2022');
      await I.enterDeceasedAddress(language);

      await I.selectDiedEngOrWales(language, optionNo);
      await I.selectEnglishForeignDeathCert(language, optionNo);
      await I.selectForeignDeathCertTranslation(language, optionYes);

      await I.selectEEComplete(language, optionYes);
      await I.selectSubmittedToHmrc(language, optionYes);
      await I.selectHmrcLetterComplete(language, optionYes);
      await I.enterHmrcCode(language, hmrcCode);
      await I.enterProbateAssetValues(language, 400000, 400000);

      await I.selectAssetsOutsideEnglandWales(language, optionYes);
      await I.enterValueAssetsOutsideEnglandWales(language, '400000');
      await I.selectDeceasedAlias(language, optionNo);
      await I.selectDeceasedMaritalStatus(language, maritalStatusMarried);

      await bilingualGopPage.selectNo();

      await deceasedNamePage.fillDeceasedNameAndContinue(
        deceased.firstName,
        deceased.lastName,
      );

      await deceasedDobPage.fillDobAndContinue(
        deceased.dob.day,
        deceased.dob.month,
        deceased.dob.year,
      );

      await deceasedDodPage.fillDodAndContinue(
        deceased.dod.day,
        deceased.dod.month,
        deceased.dod.year,
      );

      await deceasedAddressPage.enterManualAddressAndContinue(
        deceased.address.line1,
        deceased.address.line2,
        deceased.address.line3,
        deceased.address.town,
        deceased.address.postcode,
        deceased.address.country,
      );

      await diedEngOrWalesPage.selectYes();
      await certificateInterimPage.selectDeathCertificate();
      await calcCheckPage.selectYes();
      await newSubmittedToHmrcPage.selectYes();
      await hmrcLetterPage.selectYes();
      await uniqueProbateCodePage.enterUniqueProbateCodeAndContinue(commonIntestacyScenario.uniqueProbateCode);
      await probateEstateValuesPage.enterEstateValuesAndContinue(
        commonIntestacyScenario.probateEstateValues.grossValue,
        commonIntestacyScenario.probateEstateValues.netValue,
      );
      await assetsOutsideEnglandWalesPage.selectNo();
      await deceasedAliasPage.selectNo();
      await deceasedMaritalStatusPage.selectMarried();

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
