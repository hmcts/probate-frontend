import { test, expect } from '../../fixtures/fixtures';

test.describe('Intestacy sole child journey', async () => {
  test('happy path', async ({
    signInPage,
    dashboardPage,
    startEligibilityPage,
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
    diedEnglandOrWalesPage,
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
    applicantAddressPage,
  }) => {
    await signInPage.login();
    await dashboardPage.clickStartNewApplication();
    await startEligibilityPage.continue();
    await deathCertificatePage.selectYes();
    await deathCertificateEnglishPage.selectYes();
    await deceasedDomicilePage.selectYes();
    await eeDeceasedDodPage.selectYes();
    await eeEstateValuedPage.selectYes();
    await willLeftPage.selectNo();
    await relatedToDeceasedPage.selectChild();
    await taskListPage.clickTellUsAboutDeceased();
    await bilingualGopPage.selectYes();
    await deceasedNamePage.fillDeceasedNameAndContinue('John', 'Smith');
    await deceasedDobPage.fillDateOfBirthAndContinue('01', '01', '1950');
    await deceasedDodPage.fillDateOfDeathAndContinue('15', '06', '2025');
    await deceasedAddressPage.enterAddressAndContinue();
    await diedEnglandOrWalesPage.selectYes();
    await certificateInterimPage.chooseCertificateType('deathCertificate');
    await calcCheckPage.selectYes();
    await newSubmittedToHmrcPage.selectYes();
    await hmrcLetterPage.selectYes();
    await uniqueProbateCodePage.fillUniqueProbateCodeAndContinue('CTS 040523 1104 3tpp s8e9');
    await probateEstateValuesPage.fillEstateValuesAndContinue('2500', '2000');
    await assetsOutsideEnglandWalesPage.selectNo();
    await deceasedAliasPage.selectNo();
    await deceasedMaritalStatusPage.selectMarriedAndContinue();
    await taskListPage.clickGiveDetailsAboutThePeopleApplying();
    await relationshipToDeceasedPage.selectChildAndContinue();
    await spouseNotApplyingReasonPage.selectGivingUpRightToApplyAndContinue();
    await mainApplicantAdoptedInPage.selectYesAndContinue();
    await adoptedInEnglandOrWalesPage.selectYesAndContinue();
    await anyOtherChildrenPage.selectYesAndContinue();
    await anyPredeceasedChildrenPage.selectYesSomeAndContinue();
    await anySurvivingGrandchildrenPage.selectYesAndContinue();
    await anyGrandchildrenUnder18Page.selectNoAndContinue();
    await allChildrenOver18Page.selectYesAndContinue();
    await applicantNamePage.fillApplicantNameAndContinue('Jane', 'Doe');
    await applicantPhonePage.fillApplicantPhoneAndContinue('07771 900 900');
    await applicantAddressPage.enterAddressAndContinue();
  });
});
