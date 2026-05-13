import { test } from '../../../fixtures/test';
import {
  deceased,
  soleChildApplicant,
  paymentDetails,
  commonIntestacyScenario,
} from '../../../data/intestacy/sole/scenarios';
import { ROUTES } from '../../../constants/routes';

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
