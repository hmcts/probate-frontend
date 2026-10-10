import { test } from '../../../fixtures/test.ts';
import {
  deceased,
  paymentDetails,
  soleSpouseApplicant,
  commonIntestacyScenario,
} from '../../../data/intestacy/sole/scenarios.ts';
import { ROUTES } from '../../../constants/routes.ts';

test.describe('Intestacy sole spouse journey', () => {
  test('Go through eligibility and log in from start-apply', async ({
    page,
    deathCertificatePage,
    deathCertificateEnglishPage,
    deceasedDomicilePage,
    eeDeceasedDodPage,
    eeEstateValuedPage,
    willLeftPage,
    relatedToDeceasedPage,
    taskListPage,
    bilingualGopPage,
    deceasedNamePage,
    deceasedDobPage,
    deceasedDodPage,
    deceasedAddressPage,
    diedEngOrWalesPage,
    certificateInterimPage,
    calcCheckPage,
    newSubmittedToHmrcPage,
    hmrcLetterPage,
    uniqueProbateCodePage,
    probateEstateValuesPage,
    assetsOutsideEnglandWalesPage,
    deceasedAliasPage,
    deceasedMaritalStatusPage,
    relationshipToDeceasedPage,
    applicantNamePage,
    applicantPhonePage,
    mainApplicantAddressPage,
    equalityAndDiversityPage,
    summaryDeclarationPage,
    declarationPage,
    copiesUkPage,
    assetsOverseasPage,
    copiesOverseasPage,
    copiesSummaryPage,
    paymentBreakdownPage,
    cardDetailsPage,
    cardConfirmPage,
    thankYouPage,

  }) => {
    await page.goto('/death-certificate');

    await deathCertificatePage.selectYes();
    await deathCertificateEnglishPage.selectYes();
    await deceasedDomicilePage.selectYes();
    await eeDeceasedDodPage.selectYes();
    await eeEstateValuedPage.selectYes();
    await willLeftPage.selectNo();
    await relatedToDeceasedPage.selectSpouse();

    await taskListPage.clickTellUsAboutThePersonWhoHasDied();
    await bilingualGopPage.selectNo();
    await deceasedNamePage.fillDeceasedNameAndContinue(deceased.firstName, deceased.lastName);
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
    await certificateInterimPage.selectCertificate('death');
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
    await relationshipToDeceasedPage.selectSpouse();
    await applicantNamePage.enterApplicantName(soleSpouseApplicant.firstName, soleSpouseApplicant.lastName);
    await applicantPhonePage.enterApplicantPhoneNumber(soleSpouseApplicant.phoneNumber);
    await mainApplicantAddressPage.enterManualAddressAndContinue(
      soleSpouseApplicant.address.line1,
      soleSpouseApplicant.address.line2,
      soleSpouseApplicant.address.line3,
      soleSpouseApplicant.address.town,
      soleSpouseApplicant.address.postcode,
      soleSpouseApplicant.address.country,
    );

    await equalityAndDiversityPage.optOut();
    await taskListPage.goToDeclaration();
    await summaryDeclarationPage.continueToDeclaration();
    await declarationPage.confirmDeclarationAndContinue(ROUTES.taskList);
    await taskListPage.goToPayAndSubmit();
    await copiesUkPage.enterExtraOfficialCopiesAndContinue('1');
    await assetsOverseasPage.selectYes();
    await copiesOverseasPage.enterExtraCertifiedCopiesAndContinue('1');
    await copiesSummaryPage.saveAndContinue();
    await paymentBreakdownPage.payAndSubmitApplication(ROUTES.cardDetails);
    await cardDetailsPage.fillCardDetailsAndContinue(paymentDetails);
    await cardConfirmPage.confirmPayment();
    await thankYouPage.expectApplicationSubmitted();

    const caseId = await thankYouPage.getCaseId();
    console.log(`Case ID: ${caseId}`);
  });
});
