import { test as base, expect, Page } from '@playwright/test';
import { DeathCertificatePage } from '../pages/intestacy/eligibility/DeathCertificatePage';
import { DeceasedNamePage } from '../pages/intestacy/deceased/DeceasedNamePage';
import { DeathCertificateEnglishPage } from '../pages/intestacy/eligibility/DeathCertificateEnglishPage';
import { DeceasedDomicilePage } from '../pages/intestacy/eligibility/DeceasedDomicilePage';
import { EeDeceasedDodPage } from '../pages/intestacy/eligibility/EeDeceasedDodPage';
import { EeEstateValuedPage } from '../pages/intestacy/eligibility/EeEstateValuedPage';
import { WillLeftPage } from '../pages/intestacy/eligibility/WillLeftPage';
import { RelatedToDeceasedPage } from '../pages/intestacy/eligibility/RelatedToDeceasedPage';
import { StartApplyPage } from '../pages/common/start-apply/StartApplyPage';
import { SignInPage } from '../pages/common/auth/SignInPage';
import { DashboardPage } from '../pages/common/dashboard/DashboardPage';
import { TaskListPage } from '../pages/common/dashboard/TaskListPage';
import { BilingualGopPage } from '../pages/intestacy/deceased/BilingualGopPage';
import { DeceasedDobPage } from '../pages/intestacy/eligibility/DeceasedDobPage';
import { DeceasedDodPage } from '../pages/intestacy/eligibility/DeceasedDodPage';
import { DeceasedAddressPage } from '../pages/intestacy/deceased/DeceasedAddressPage';
import { DiedEngOrWalesPage } from '../pages/intestacy/deceased/DiedEngOrWalesPage';
import { CertificateInterimPage } from '../pages/intestacy/deceased/CertificateInterimPage';  
import { CalcCheckPage } from '../pages/intestacy/deceased/CalcCheckPage';
import { NewSubmittedToHmrcPage } from '../pages/intestacy/deceased/NewSubmittedToHmrcPage';
import { HmrcLetterPage } from '../pages/intestacy/deceased/HmrcLetterPage';
import { UniqueProbateCodePage } from '../pages/intestacy/deceased/UniqueProbateCodePage';
import { ProbateEstateValuesPage } from '../pages/intestacy/deceased/ProbateEstateValuesPage';
import { AssetsOutsideEnglandWalesPage } from '../pages/intestacy/deceased/AssetsOutsideEnglandWalesPage';
import { DeceasedAliasPage } from '../pages/intestacy/deceased/DeceasedAliasPage';
import { DeceasedMaritalStatusPage } from '../pages/intestacy/deceased/DeceasedMaritalStatusPage';

type Pages = {
  deathCertificatePage: DeathCertificatePage;
  deathCertificateEnglishPage: DeathCertificateEnglishPage;
  deceasedDomicilePage: DeceasedDomicilePage;
  eeDeceasedDodPage: EeDeceasedDodPage;
  eeEstateValuedPage: EeEstateValuedPage;
  willLeftPage: WillLeftPage;
  relatedToDeceasedPage: RelatedToDeceasedPage;
  startApplyPage: StartApplyPage;
  signInPage: SignInPage;
  dashboardPage: DashboardPage;
  taskListPage: TaskListPage;
  deceasedNamePage: DeceasedNamePage;
  bilingualGopPage: BilingualGopPage;
  deceasedDobPage: DeceasedDobPage;
  deceasedDodPage: DeceasedDodPage;
  deceasedAddressPage: DeceasedAddressPage;
  diedEngOrWalesPage: DiedEngOrWalesPage;
  certificateInterimPage: CertificateInterimPage;
  calcCheckPage: CalcCheckPage;
  newSubmittedToHmrcPage: NewSubmittedToHmrcPage;
  hmrcLetterPage: HmrcLetterPage;
  uniqueProbateCodePage: UniqueProbateCodePage;
  probateEstateValuesPage: ProbateEstateValuesPage;
  assetsOutsideEnglandWalesPage: AssetsOutsideEnglandWalesPage;
  deceasedAliasPage: DeceasedAliasPage;
  deceasedMaritalStatusPage: DeceasedMaritalStatusPage;
};

export const test = base.extend<Pages>({
  deathCertificatePage: async ({ page }: { page: Page }, use) => {
    await use(new DeathCertificatePage(page));
  },

  deathCertificateEnglishPage: async ({ page }: { page: Page }, use) => {
    await use(new DeathCertificateEnglishPage(page));
  },

  deceasedDomicilePage: async ({ page }: { page: Page }, use) => {
    await use(new DeceasedDomicilePage(page));
  },

  eeDeceasedDodPage: async ({ page }: { page: Page }, use) => {
    await use(new EeDeceasedDodPage(page));
  },

  eeEstateValuedPage: async ({ page }: { page: Page }, use) => {
    await use(new EeEstateValuedPage(page));
  },

  willLeftPage: async ({ page }: { page: Page }, use) => {
    await use(new WillLeftPage(page));
  },

  relatedToDeceasedPage: async ({ page }: { page: Page }, use) => {
    await use(new RelatedToDeceasedPage(page));
  },

  startApplyPage: async ({ page }: { page: Page }, use) => {
    await use(new StartApplyPage(page));
  },

  signInPage: async ({ page }: { page: Page }, use) => {
    await use(new SignInPage(page));
  },

  dashboardPage: async ({ page }: { page: Page }, use) => {
    await use(new DashboardPage(page));
  },

  taskListPage: async ({ page }: { page: Page }, use) => {
    await use(new TaskListPage(page));
  },

  deceasedNamePage: async ({ page }: { page: Page }, use) => {
    await use(new DeceasedNamePage(page));
  },

  bilingualGopPage: async ({ page }: { page: Page }, use) => {
    await use(new BilingualGopPage(page));
  },

  deceasedDobPage: async ({ page }: { page: Page }, use) => {
    await use(new DeceasedDobPage(page));
  },

  deceasedDodPage: async ({ page }: { page: Page }, use) => {
    await use(new DeceasedDodPage(page));
  },

  deceasedAddressPage: async ({ page }: { page: Page }, use) => {
    await use(new DeceasedAddressPage(page));
  },

  diedEngOrWalesPage: async ({ page }: { page: Page }, use) => {
    await use(new DiedEngOrWalesPage(page));
  },
  certificateInterimPage: async ({ page }: { page: Page }, use) => {
    await use(new CertificateInterimPage(page));
  },
  calcCheckPage: async ({ page }: { page: Page }, use) => {
    await use(new CalcCheckPage(page));
  },
  newSubmittedToHmrcPage: async ({ page }: { page: Page }, use) => {
    await use(new NewSubmittedToHmrcPage(page));
  },
  hmrcLetterPage: async ({ page }: { page: Page }, use) => {
    await use(new HmrcLetterPage(page));
  },
  uniqueProbateCodePage: async ({ page }: { page: Page }, use) => {
    await use(new UniqueProbateCodePage(page));
  },
  probateEstateValuesPage: async ({ page }: { page: Page }, use) => {
    await use(new ProbateEstateValuesPage(page));
  },
  assetsOutsideEnglandWalesPage: async ({ page }: { page: Page }, use) => {
    await use(new AssetsOutsideEnglandWalesPage(page));
  },
  deceasedAliasPage: async ({ page }: { page: Page }, use) => {
    await use(new DeceasedAliasPage(page));
  },
  deceasedMaritalStatusPage: async ({ page }: { page: Page }, use) => {
    await use(new DeceasedMaritalStatusPage(page));
  },
});

export { expect };
