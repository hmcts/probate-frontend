import { test } from '../../../fixtures/test';
import { deceased, paymentDetails, soleGrandchildApplicant, commonIntestacyScenario, } from '../../../data/intestacy/sole/scenarios';
import { ROUTES } from '../../../constants/routes';

test.describe('Intestacy sole grandchild journey', () => {
  test('Sign in and complete deceased details as grandchild applicant', async ({
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
    mainApplicantsParentAlivePage,
    mainApplicantsParentAdoptedInPage,
    parentAdoptionPlacePage,
    mainApplicantAdoptedInPage,
    adoptedInEnglandOrWalesPage,
    anyOtherChildrenPage,
    anyPredeceasedChildrenPage,
    anySurvivingGrandchildrenPage,
    anyGrandchildrenUnder18Page,
    allChildrenOver18Page,
    mainApplicantsParentAnyOtherChildrenPage,
    allGrandchildrenOver18Page,
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
    await relatedToDeceasedPage.selectGrandchild();

    await taskListPage.clickTellUsAboutThePersonWhoHasDied();
    await bilingualGopPage.selectYes();

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
    await deceasedMaritalStatusPage.selectMarried();
    await taskListPage.clickGiveDetailsAboutThePeopleApplying();
    await relationshipToDeceasedPage.selectGrandchild();
    await spouseNotApplyingReasonPage.selectGivingUpRightToApply();
    await mainApplicantsParentAlivePage.selectNo();
    await mainApplicantsParentAdoptedInPage.selectYes();
    await parentAdoptionPlacePage.selectYes();
    await mainApplicantAdoptedInPage.selectYes();
    await adoptedInEnglandOrWalesPage.selectYes(ROUTES.intestacyAnyOtherChildren);
    await anyOtherChildrenPage.selectYes();
    await anyPredeceasedChildrenPage.selectYesSome();
    await anySurvivingGrandchildrenPage.selectYes();
    await anyGrandchildrenUnder18Page.selectNo();
    await allChildrenOver18Page.selectYes(ROUTES.intestacyMainApplicantsParentAnyOtherChildren);
    await mainApplicantsParentAnyOtherChildrenPage.selectYes();
    await allGrandchildrenOver18Page.selectYes();
    await applicantNamePage.enterApplicantName(soleGrandchildApplicant.firstName, soleGrandchildApplicant.lastName);
    await applicantPhonePage.enterApplicantPhoneNumber(soleGrandchildApplicant.phoneNumber);
    await mainApplicantAddressPage.enterManualAddressAndContinue(
      soleGrandchildApplicant.address.line1,
      soleGrandchildApplicant.address.line2,
      soleGrandchildApplicant.address.line3,
      soleGrandchildApplicant.address.town,
      soleGrandchildApplicant.address.postcode,
      soleGrandchildApplicant.address.country,
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
