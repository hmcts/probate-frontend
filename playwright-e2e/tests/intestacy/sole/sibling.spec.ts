import { test } from '../../../fixtures/test';
import { deceased, paymentDetails, soleSiblingApplicant, commonIntestacyScenario, } from '../../../data/intestacy/sole/scenarios';
import { ROUTES } from '../../../constants/routes';
import { CardDetailsPage } from '../../../pages/intestacy/payment/CardDetailsPage';

test.describe('Intestacy sole sibling journey', () => {
  test('Sign in and complete deceased details as sibling applicant', async ({
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

    // sibling-journey specific pages
    anyLivingDescendantsPage,
    anyLivingParentsPage,
    deceasedAdoptedInPage,
    deceasedAdoptionPlacePage,
    deceasedSameParentsPage,
    mainApplicantAdoptedInPage,
    adoptedInEnglandOrWalesPage,
    deceasedOtherWholeSiblingsPage,
    deceasedWholeSiblingsPage,
    wholeSiblingsSurvivingChildrenPage,
    wholeNiecesWholeNephewsAgePage,
    wholeSiblingsAgePage,
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

    // Eligibility
    await deathCertificatePage.selectYes();
    await deathCertificateEnglishPage.selectYes();
    await deceasedDomicilePage.selectYes();
    await eeDeceasedDodPage.selectYes();
    await eeEstateValuedPage.selectYes();
    await willLeftPage.selectNo();
    await relatedToDeceasedPage.selectSibling();

    // Deceased details
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

    // Applicant details
    await taskListPage.clickGiveDetailsAboutThePeopleApplying();
    await relationshipToDeceasedPage.selectSibling();

    // sibling route specific questions
    await anyLivingDescendantsPage.selectNo();
    await anyLivingParentsPage.selectNo();
    await deceasedAdoptedInPage.selectYes();
    await deceasedAdoptionPlacePage.selectYes(ROUTES.intestacyDeceasedSameParents);
    await deceasedSameParentsPage.selectBothParentsSame(ROUTES.intestacyMainApplicantAdoptedIn);
    await mainApplicantAdoptedInPage.selectYes();
    await adoptedInEnglandOrWalesPage.selectYes(ROUTES.intestacyDeceasedOtherWholeSiblings);
    await deceasedOtherWholeSiblingsPage.selectYes();
    await deceasedWholeSiblingsPage.selectYesSomeOfThem();
    await wholeSiblingsSurvivingChildrenPage.selectYes();
    await wholeNiecesWholeNephewsAgePage.selectYes();
    await wholeSiblingsAgePage.selectYes();
    await applicantNamePage.enterApplicantName(
        soleSiblingApplicant.firstName,
        soleSiblingApplicant.lastName,
    );

    await applicantPhonePage.enterApplicantPhoneNumber(
        soleSiblingApplicant.phoneNumber,
    );

    await mainApplicantAddressPage.enterManualAddressAndContinue(
        soleSiblingApplicant.address.line1,
        soleSiblingApplicant.address.line2,
        soleSiblingApplicant.address.line3,
        soleSiblingApplicant.address.town,
        soleSiblingApplicant.address.postcode,
        soleSiblingApplicant.address.country,
    );

    await jointApplicationPage.selectNo();
    await equalityAndDiversityPage.optOut();

    // Declaration
    await taskListPage.goToDeclaration();
    await summaryDeclarationPage.continueToDeclaration();
    await declarationPage.confirmDeclarationAndContinue(ROUTES.taskList);

    // Payment and submit
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
