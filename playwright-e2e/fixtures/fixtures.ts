import { test as base, expect } from '@playwright/test';
import { SignInPage } from '../pages/auth/SignInPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { TaskListPage } from '../pages/dashboard/TaskListPage';
import { DeathCertificatePage } from '../pages/deceased/DeathCertificatePage';
import { DeathCertificateEnglishPage } from '../pages/deceased/DeathCertificateEnglishPage';
import { DeceasedNamePage } from '../pages/deceased/DeceasedNamePage';
import { DeceasedDomicilePage } from '../pages/deceased/DeceasedDomicilePage';
import { AssetsOverseasPage } from '../pages/intestacy/AssetsOverseasPage';
import { BilingualGopPage } from '../pages/intestacy/BilingualGopPage';
import { CopiesUkPage } from '../pages/intestacy/CopiesUkPage';
import { DeceasedAddressPage } from '../pages/intestacy/DeceasedAddressPage';
import { DeceasedDobPage } from '../pages/intestacy/DeceasedDobPage';
import { DeceasedDodPage } from '../pages/intestacy/DeceasedDodPage';
import { DiedEnglandOrWalesPage } from '../pages/intestacy/DiedEnglandOrWalesPage';
import { EeDeceasedDodPage } from '../pages/intestacy/EeDeceasedDodPage';
import { EeEstateValuedPage } from '../pages/intestacy/EeEstateValuedPage';
import { RelatedToDeceasedPage } from '../pages/screeners/RelatedToDeceasedPage';
import { RelationshipToDeceasedPage } from '../pages/screeners/RelationshipToDeceasedPage';
import { StartEligibilityPage } from '../pages/screeners/StartEligibilityPage';
import { WillLeftPage } from '../pages/screeners/WillLeftPage';
import { CertificateInterimPage } from '../pages/intestacy/CertificateInterimPage.ts';
import { CalcCheckPage } from '../pages/intestacy/CalcCheckPage.ts';
import { NewSubmittedToHmrcPage } from '../pages/intestacy/NewSubmittedToHmrcPage.ts';
import { HmrcLetterPage } from '../pages/intestacy/HmrcLetterPage.ts';
import { UniqueProbateCodePage } from '../pages/intestacy/UniqueProbateCodePage.ts';
import { ProbateEstateValuesPage } from '../pages/intestacy/ProbateEstateValuesPage.ts';
import { AssetsOutsideEnglandWalesPage } from '../pages/intestacy/AssetsOutsideEnglandWalesPage.ts';
import { DeceasedAliasPage } from '../pages/intestacy/DeceasedAliasPage.ts';
import { DeceasedMaritalStatusPage } from '../pages/intestacy/DeceasedMaritalStatusPage.ts';
import { SpouseNotApplyingReasonPage } from '../pages/intestacy/SpouseNotApplyingReasonPage.ts';
import { MainApplicantAdoptedInPage } from '../pages/intestacy/MainApplicantAdoptedInPage.ts';
import { AdoptedInEnglandOrWalesPage } from '../pages/intestacy/AdoptedInEnglandOrWalesPage.ts';
import { AnyOtherChildrenPage } from '../pages/intestacy/AnyOtherChildrenPage.ts';
import { AnyPredeceasedChildrenPage } from '../pages/intestacy/AnyPredeceasedChildrenPage.ts';
import { AnySurvivingGrandchildrenPage } from '../pages/intestacy/AnySurvivingGrandchildrenPage.ts';
import { AnyGrandchildrenUnder18Page } from '../pages/intestacy/AnyGrandchildrenUnder18Page.ts';
import { AllChildrenOver18Page } from '../pages/intestacy/AllChildrenOver18Page.ts';
import { ApplicantNamePage } from '../pages/intestacy/ApplicantNamePage.ts';
import { ApplicantPhonePage } from '../pages/intestacy/ApplicantPhonePage.ts';
import { ApplicantAddressPage } from '../pages/intestacy/ApplicantAddressPage.ts';



type Fixtures = {
  signInPage: SignInPage;
  dashboardPage: DashboardPage;
  taskListPage: TaskListPage;
  startEligibilityPage: StartEligibilityPage;
  deathCertificatePage: DeathCertificatePage;
  deathCertificateEnglishPage: DeathCertificateEnglishPage;
  deceasedNamePage: DeceasedNamePage;
  deceasedDomicilePage: DeceasedDomicilePage;
  deceasedDobPage: DeceasedDobPage;
  deceasedDodPage: DeceasedDodPage;
  deceasedAddressPage: DeceasedAddressPage;
  diedEnglandOrWalesPage: DiedEnglandOrWalesPage;
  eeDeceasedDodPage: EeDeceasedDodPage;
  eeEstateValuedPage: EeEstateValuedPage;
  willLeftPage: WillLeftPage;
  relatedToDeceasedPage: RelatedToDeceasedPage;
  relationshipToDeceasedPage: RelationshipToDeceasedPage;
  bilingualGopPage: BilingualGopPage;
  copiesUkPage: CopiesUkPage;
  assetsOverseasPage: AssetsOverseasPage;
  certificateInterimPage: CertificateInterimPage;
  calcCheckPage: CalcCheckPage;
  newSubmittedToHmrcPage: NewSubmittedToHmrcPage;
  hmrcLetterPage: HmrcLetterPage;
  uniqueProbateCodePage: UniqueProbateCodePage;
  probateEstateValuesPage: ProbateEstateValuesPage;
  assetsOutsideEnglandWalesPage: AssetsOutsideEnglandWalesPage;
  deceasedAliasPage: DeceasedAliasPage;
  deceasedMaritalStatusPage: DeceasedMaritalStatusPage;
  spouseNotApplyingReasonPage: SpouseNotApplyingReasonPage;
  mainApplicantAdoptedInPage: MainApplicantAdoptedInPage;
  adoptedInEnglandOrWalesPage: AdoptedInEnglandOrWalesPage;
  anyOtherChildrenPage: AnyOtherChildrenPage;
  anyPredeceasedChildrenPage: AnyPredeceasedChildrenPage;
  anySurvivingGrandchildrenPage: AnySurvivingGrandchildrenPage;
  anyGrandchildrenUnder18Page: AnyGrandchildrenUnder18Page;
  allChildrenOver18Page: AllChildrenOver18Page;
  applicantNamePage: ApplicantNamePage;
  applicantPhonePage: ApplicantPhonePage;
  applicantAddressPage: ApplicantAddressPage;
};

export const test = base.extend<Fixtures>({
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  taskListPage: async ({ page }, use) => {
    await use(new TaskListPage(page));
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
  deceasedNamePage: async ({ page }, use) => {
    await use(new DeceasedNamePage(page));
  },
  deceasedDomicilePage: async ({ page }, use) => {
    await use(new DeceasedDomicilePage(page));
  },
  deceasedDobPage: async ({ page }, use) => {
    await use(new DeceasedDobPage(page));
  },
  deceasedDodPage: async ({ page }, use) => {
    await use(new DeceasedDodPage(page));
  },
  deceasedAddressPage: async ({ page }, use) => {
    await use(new DeceasedAddressPage(page));
  },
  diedEnglandOrWalesPage: async ({ page }, use) => {
    await use(new DiedEnglandOrWalesPage(page));
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
  relatedToDeceasedPage: async ({ page }, use) => {
    await use(new RelatedToDeceasedPage(page));
  },
  relationshipToDeceasedPage: async ({ page }, use) => {
    await use(new RelationshipToDeceasedPage(page));
  },
  bilingualGopPage: async ({ page }, use) => {
    await use(new BilingualGopPage(page));
  },
  copiesUkPage: async ({ page }, use) => {
    await use(new CopiesUkPage(page));
  },
  assetsOverseasPage: async ({ page }, use) => {
    await use(new AssetsOverseasPage(page));
  },
  certificateInterimPage: async ({ page }, use) => {
    await use(new CertificateInterimPage(page));
  },
  calcCheckPage: async ({ page }, use) => {
    await use(new CalcCheckPage(page));
  },
  newSubmittedToHmrcPage: async ({ page }, use) => {
    await use(new NewSubmittedToHmrcPage(page));
  },
  hmrcLetterPage: async ({ page }, use) => {
    await use(new HmrcLetterPage(page));
  },
  uniqueProbateCodePage: async ({ page }, use) => {
    await use(new UniqueProbateCodePage(page));
  },
  probateEstateValuesPage: async ({ page }, use) => {
    await use(new ProbateEstateValuesPage(page));
  },
  assetsOutsideEnglandWalesPage: async ({ page }, use) => {
    await use(new AssetsOutsideEnglandWalesPage(page));
  },
  deceasedAliasPage: async ({ page }, use) => {
    await use(new DeceasedAliasPage(page));
  },
  deceasedMaritalStatusPage: async ({ page }, use) => {
    await use(new DeceasedMaritalStatusPage(page));
  },
  spouseNotApplyingReasonPage: async ({ page }, use) => {
    await use(new SpouseNotApplyingReasonPage(page));
  },
  mainApplicantAdoptedInPage: async ({ page }, use) => {
    await use(new MainApplicantAdoptedInPage(page));
  },
  adoptedInEnglandOrWalesPage: async ({ page }, use) => {
    await use(new AdoptedInEnglandOrWalesPage(page));
  },
  anyOtherChildrenPage: async ({ page }, use) => {
    await use(new AnyOtherChildrenPage(page));
  },
  anyPredeceasedChildrenPage: async ({ page }, use) => {
    await use(new AnyPredeceasedChildrenPage(page));
  },
  anySurvivingGrandchildrenPage: async ({ page }, use) => {
    await use(new AnySurvivingGrandchildrenPage(page));
  },
  anyGrandchildrenUnder18Page: async ({ page }, use) => {
    await use(new AnyGrandchildrenUnder18Page(page));
  },
  allChildrenOver18Page: async ({ page }, use) => {
    await use(new AllChildrenOver18Page(page));
  },
  applicantNamePage: async ({ page }, use) => {
    await use(new ApplicantNamePage(page));
  },
  applicantPhonePage: async ({ page }, use) => {
    await use(new ApplicantPhonePage(page));
  },
    applicantAddressPage: async ({ page }, use) => {
    await use(new ApplicantAddressPage(page));
  },
});

export { expect };
