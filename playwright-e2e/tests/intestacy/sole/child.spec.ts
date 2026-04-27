import { test } from '../../../fixtures/test';
import { deceased, mainApplicant, paymentDetails } from '../../../data/intestacy/sole/child.scenarios';

test.describe('Intestacy sole child journey', () => {
  test('Go to death-certificate page and complete deceased details', async ({
    page,
    deathCertificatePage,
    deathCertificateEnglishPage,
    deceasedDomicilePage,
    eeDeceasedDodPage,
    eeEstateValuedPage,
    willLeftPage,
    relatedToDeceasedPage,
    dashboardPage,
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
    spouseNotApplyingReasonPage,
    mainApplicantAdoptedInPage,
    adoptedInEnglandOrWalesPage,
    anyOtherChildrenPage,
    anyPredeceasedChildrenPage,
    anySurvivingGrandchildrenPage,
    anyGrandchildrenUnder18Page,
    allChildrenOver18Page,
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
    await relatedToDeceasedPage.selectChild();
    await page.goto('/dashboard');
    await dashboardPage.continueDraftApplicationWithoutName();
    await taskListPage.expectLoaded();
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
    await certificateInterimPage.selectDeathCertificate();
    await calcCheckPage.selectYes();
    await newSubmittedToHmrcPage.selectYes();
    await hmrcLetterPage.selectYes();
    await uniqueProbateCodePage.enterUniqueProbateCodeAndContinue('CTS 040523 1104 3tpp s8e9');
    await probateEstateValuesPage.enterEstateValuesAndContinue('2500', '2000');
    await assetsOutsideEnglandWalesPage.selectNo();
    await deceasedAliasPage.selectNo();
    await deceasedMaritalStatusPage.selectMarried();
    await taskListPage.clickGiveDetailsAboutThePeopleApplying();
    await relationshipToDeceasedPage.selectChild();
    await spouseNotApplyingReasonPage.selectGivingUpRightToApply();
    await mainApplicantAdoptedInPage.selectYes();
    await adoptedInEnglandOrWalesPage.selectYes();
    await anyOtherChildrenPage.selectYes();
    await anyPredeceasedChildrenPage.selectYesSome();
    await anySurvivingGrandchildrenPage.selectYes();
    await anyGrandchildrenUnder18Page.selectNo();
    await allChildrenOver18Page.selectYes();
    await applicantNamePage.enterApplicantName(mainApplicant.firstName, mainApplicant.lastName);
    await applicantPhonePage.enterPhoneNumber(mainApplicant.phoneNumber);
    await mainApplicantAddressPage.enterManualAddressAndContinue(
      mainApplicant.address.line1,
      mainApplicant.address.line2,
      mainApplicant.address.line3,
      mainApplicant.address.town,
      mainApplicant.address.postcode,
      mainApplicant.address.country,
    );
    await jointApplicationPage.selectNo();
    await equalityAndDiversityPage.optOut();
    await taskListPage.goToDeclaration();
    await summaryDeclarationPage.saveAndContinue();
    await declarationPage.confirmDeclarationAndContinue();
    await taskListPage.goToPayAndSubmit();
    await copiesUkPage.enterExtraOfficialCopiesAndContinue('1');
    await assetsOverseasPage.selectYes();
    await copiesOverseasPage.enterExtraCertifiedCopiesAndContinue('1');
    await copiesSummaryPage.saveAndContinue();
    await paymentBreakdownPage.payAndSubmitApplication();
    await cardDetailsPage.fillCardDetailsAndContinue(paymentDetails);
    await cardConfirmPage.confirmPayment();
    await thankYouPage.expectApplicationSubmitted();
    await thankYouPage.printCaseId();

  });
});
