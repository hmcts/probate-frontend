import { test as base, expect } from '@playwright/test';
import { SignInPage } from '../pages/auth/SignInPage';
import { DeathCertificatePage } from '../pages/deceased/DeathCertificatePage';
import { DeathCertificateEnglishPage } from '../pages/deceased/DeathCertificateEnglishPage';
import { DeceasedDomicilePage } from '../pages/deceased/DeceasedDomicilePage';
import { EeDeceasedDodPage } from '../pages/intestacy/EeDeceasedDodPage';
import { EeEstateValuedPage } from '../pages/intestacy/EeEstateValuedPage';
import { WillLeftPage } from '../pages/screeners/WillLeftPage';
import { StartEligibilityPage } from '../pages/screeners/StartEligibilityPage';

type Fixtures = {
  signInPage: SignInPage;
  startEligibilityPage: StartEligibilityPage;
  deathCertificatePage: DeathCertificatePage;
  deathCertificateEnglishPage: DeathCertificateEnglishPage;
  deceasedDomicilePage: DeceasedDomicilePage;
  eeDeceasedDodPage: EeDeceasedDodPage;
  eeEstateValuedPage: EeEstateValuedPage;
  willLeftPage: WillLeftPage;
};

export const test = base.extend<Fixtures>({
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
  startEligibilityPage: async ({ page }, use) => {
    await use(new StartEligibilityPage(page));
  },
  deathCertificatePage: async ({ page }, use) => {
    await use(new DeathCertificatePage(page));
  },
  deathCertificateEnglishPage: async ({ page }, use) => {
    await use(new DeathCertificateEnglishPage(page));
  },
  deceasedDomicilePage: async ({ page }, use) => {
    await use(new DeceasedDomicilePage(page));
  },
  eeDeceasedDodPage: async ({ page }, use) => {
    await use(new EeDeceasedDodPage(page));
  },
  eeEstateValuedPage: async ({ page }, use) => {
    await use(new EeEstateValuedPage(page));
  },
  willLeftPage: async ({ page }, use) => {
    await use(new WillLeftPage(page));
  },
});

export { expect };
