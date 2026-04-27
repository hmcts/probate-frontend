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
import { RelationshipToDeceasedPage } from '../pages/intestacy/applicant/RelationshipToDeceasedPage';
import { SpouseNotApplyingReasonPage } from '../pages/intestacy/applicant/SpouseNotApplyingReasonPage';
import { MainApplicantAdoptedInPage } from '../pages/intestacy/applicant/MainApplicantAdoptedInPage';
import { AdoptedInEnglandOrWalesPage } from '../pages/intestacy/applicant/AdoptedInEnglandOrWalesPage';
import { AnyOtherChildrenPage } from '../pages/intestacy/applicant/AnyOtherChildrenPage';
import { AnyPredeceasedChildrenPage } from '../pages/intestacy/applicant/AnyPredeceasedChildrenPage';
import { AnySurvivingGrandchildrenPage } from '../pages/intestacy/applicant/AnySurvivingGrandchildrenPage';
import { AnyGrandchildrenUnder18Page } from '../pages/intestacy/applicant/AnyGrandchildrenUnder18Page';
import { AllChildrenOver18Page } from '../pages/intestacy/applicant/AllChildrenOver18Page';
import { ApplicantNamePage } from '../pages/intestacy/applicant/ApplicantNamePage';
import { ApplicantPhonePage } from '../pages/intestacy/applicant/ApplicantPhonePage';
import { MainApplicantAddressPage } from '../pages/intestacy/applicant/MainApplicantAddressPage';
import { JointApplicationPage } from '../pages/intestacy/applicant/JointApplicationPage';
import { EqualityAndDiversityPage } from '../pages/common/pcq/EqualityAndDiversityPage';
import { DeclarationPage } from '../pages/summary/DeclarationPage';
import { SummaryDeclarationPage } from '../pages/summary/SummaryDeclarationPage';
import { CopiesUkPage } from '../pages/intestacy/payment/CopiesUKPage';
import { PaymentBreakdownPage } from '../pages/intestacy/payment/PaymentBreakdownPage';
import { CopiesSummaryPage } from '../pages/intestacy/payment/CopiesSummaryPage';
import { CopiesOverseasPage } from '../pages/intestacy/payment/CopiesOverseasPage';
import { AssetsOverseasPage } from '../pages/intestacy/assets/AssetsOverseasPage';
import { CardDetailsPage } from '../pages/intestacy/payment/CardDetailsPage';
import { CardConfirmPage } from '../pages/intestacy/payment/CardConfirmPage';
import { ThankYouPage } from '../pages/common/payment/ThankYouPage';

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
  relationshipToDeceasedPage: RelationshipToDeceasedPage;
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
  mainApplicantAddressPage: MainApplicantAddressPage;
  jointApplicationPage: JointApplicationPage;
  equalityAndDiversityPage: EqualityAndDiversityPage;
  summaryDeclarationPage: SummaryDeclarationPage;
  declarationPage: DeclarationPage;
  copiesUkPage: CopiesUkPage;
  assetsOverseasPage: AssetsOverseasPage;
  copiesOverseasPage: CopiesOverseasPage;
  copiesSummaryPage: CopiesSummaryPage;
  paymentBreakdownPage: PaymentBreakdownPage;
  cardDetailsPage: CardDetailsPage;
  cardConfirmPage: CardConfirmPage;
  thankYouPage: ThankYouPage;

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
  relationshipToDeceasedPage: async ({ page }, use) => {
    await use(new RelationshipToDeceasedPage(page));
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
  mainApplicantAddressPage: async ({ page }, use) => {
    await use(new MainApplicantAddressPage(page));
  },

  jointApplicationPage: async ({ page }, use) => {
  await use(new JointApplicationPage(page));
},

equalityAndDiversityPage: async ({ page }, use) => {
  await use(new EqualityAndDiversityPage(page));
},

summaryDeclarationPage: async ({ page }, use) => {
  await use(new SummaryDeclarationPage(page));
},

declarationPage: async ({ page }, use) => {
  await use(new DeclarationPage(page));
},

copiesUkPage: async ({ page }, use) => {
  await use(new CopiesUkPage(page));
},

assetsOverseasPage: async ({ page }, use) => {
  await use(new AssetsOverseasPage(page));
},

copiesOverseasPage: async ({ page }, use) => {
  await use(new CopiesOverseasPage(page));
},

copiesSummaryPage: async ({ page }, use) => {
  await use(new CopiesSummaryPage(page));
},

paymentBreakdownPage: async ({ page }, use) => {
  await use(new PaymentBreakdownPage(page));
},

cardDetailsPage: async ({ page }, use) => {
  await use(new CardDetailsPage(page));
},

cardConfirmPage: async ({ page }, use) => {
  await use(new CardConfirmPage(page));
},

thankYouPage: async ({ page }, use) => {
  await use(new ThankYouPage(page));
},

});

export { expect };
