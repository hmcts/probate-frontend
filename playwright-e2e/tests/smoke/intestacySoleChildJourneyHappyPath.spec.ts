import { test, expect } from '../../fixtures/fixtures';

test.describe('Intestacy sole child journey', () => {
  test('happy path', async ({
    signInPage,
    startEligibilityPage,
    deathCertificatePage,
    deathCertificateEnglishPage,
    deceasedDomicilePage,
    eeDeceasedDodPage,
    eeEstateValuedPage,
    willLeftPage,
    page,
  }) => {
    await signInPage.login();

    await startEligibilityPage.continue();
    await deathCertificatePage.selectYes();
    await deathCertificateEnglishPage.selectYes();
    await deceasedDomicilePage.selectYes();
    await eeDeceasedDodPage.selectYes();
    await eeEstateValuedPage.selectYes();
    await willLeftPage.selectNo();

    await expect(page).toHaveURL(/probate\.ithc\.platform\.hmcts\.net\/.*/);
  });
});
