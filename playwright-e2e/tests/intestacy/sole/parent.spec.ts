import { test } from '../../../fixtures/test';
import { deceased, paymentDetails, soleParentApplicant, commonIntestacyScenario, } from '../../../data/intestacy/sole/scenarios';
import { ROUTES } from '../../../constants/routes';

test.describe('Intestacy sole parent journey', () => {
  test('Sign in and complete deceased details as parent applicant', async ({
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
    anyLivingDescendantsPage,
    deceasedAdoptedInPage,
    deceasedAdoptionPlacePage,
    anyOtherParentAlivePage,
    applicantNamePage,
    applicantPhonePage,
    mainApplicantAddressPage,
    jointApplicationPage,
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
    await relatedToDeceasedPage.selectParent();

    await taskListPage.clickTellUsAboutThePersonWhoHasDied();
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
    await deceasedMaritalStatusPage.selectNeverMarried();

    await taskListPage.clickGiveDetailsAboutThePeopleApplying();
    await relationshipToDeceasedPage.selectParent();
    await anyLivingDescendantsPage.selectNo();
    await deceasedAdoptedInPage.selectYes();
    await deceasedAdoptionPlacePage.selectYes(ROUTES.intestacyAnyOtherParentAlive);
    await anyOtherParentAlivePage.selectNo();

    await applicantNamePage.enterApplicantName(
      soleParentApplicant.firstName,
      soleParentApplicant.lastName,
    );

    await applicantPhonePage.enterApplicantPhoneNumber(
      soleParentApplicant.phoneNumber,
    );

    await mainApplicantAddressPage.enterManualAddressAndContinue(
      soleParentApplicant.address.line1,
      soleParentApplicant.address.line2,
      soleParentApplicant.address.line3,
      soleParentApplicant.address.town,
      soleParentApplicant.address.postcode,
      soleParentApplicant.address.country,
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
