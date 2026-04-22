import { test } from '../../../fixtures/test';
import { deceased } from '../../../data/intestacy/sole/child.scenarios';

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
  });
});
