import { test as base, expect, Page } from '@playwright/test';
import { DeathCertificatePage } from '../pages/intestacy/eligibility/DeathCertificatePage.ts';
import { DeceasedNamePage } from '../pages/intestacy/deceased/DeceasedNamePage.ts';
import { DeathCertificateEnglishPage } from '../pages/intestacy/eligibility/DeathCertificateEnglishPage.ts';
import { DeceasedDomicilePage } from '../pages/intestacy/eligibility/DeceasedDomicilePage.ts';
import { EeDeceasedDodPage } from '../pages/intestacy/eligibility/EeDeceasedDodPage.ts';
import { EeEstateValuedPage } from '../pages/intestacy/eligibility/EeEstateValuedPage.ts';
import { WillLeftPage } from '../pages/intestacy/eligibility/WillLeftPage.ts';
import { RelatedToDeceasedPage } from '../pages/intestacy/eligibility/RelatedToDeceasedPage.ts';
import { StartApplyPage } from '../pages/common/start-apply/StartApplyPage.ts';
import { SignInPage } from '../pages/common/auth/SignInPage.ts';
import { DashboardPage } from '../pages/common/dashboard/DashboardPage.ts';
import { TaskListPage } from '../pages/common/dashboard/TaskListPage.ts';
import { BilingualGopPage } from '../pages/intestacy/deceased/BilingualGopPage.ts';
import { DeceasedDobPage } from '../pages/intestacy/eligibility/DeceasedDobPage.ts';
import { DeceasedDodPage } from '../pages/intestacy/eligibility/DeceasedDodPage.ts';
import { DeceasedAddressPage } from '../pages/intestacy/deceased/DeceasedAddressPage.ts';
import { DiedEngOrWalesPage } from '../pages/intestacy/deceased/DiedEngOrWalesPage.ts';
import { CertificateInterimPage } from '../pages/intestacy/deceased/CertificateInterimPage.ts';
import { CalcCheckPage } from '../pages/intestacy/deceased/CalcCheckPage.ts';
import { NewSubmittedToHmrcPage } from '../pages/intestacy/deceased/NewSubmittedToHmrcPage.ts';
import { HmrcLetterPage } from '../pages/intestacy/deceased/HmrcLetterPage.ts';
import { UniqueProbateCodePage } from '../pages/intestacy/deceased/UniqueProbateCodePage.ts';
import { ProbateEstateValuesPage } from '../pages/intestacy/deceased/ProbateEstateValuesPage.ts';
import { AssetsOutsideEnglandWalesPage } from '../pages/intestacy/deceased/AssetsOutsideEnglandWalesPage.ts';
import { DeceasedAliasPage } from '../pages/intestacy/deceased/DeceasedAliasPage.ts';
import { DeceasedMaritalStatusPage } from '../pages/intestacy/deceased/DeceasedMaritalStatusPage.ts';
import { RelationshipToDeceasedPage } from '../pages/intestacy/applicant/RelationshipToDeceasedPage.ts';
import { SpouseNotApplyingReasonPage } from '../pages/intestacy/applicant/SpouseNotApplyingReasonPage.ts';
import { MainApplicantAdoptedInPage } from '../pages/intestacy/applicant/MainApplicantAdoptedInPage.ts';
import { AdoptedInEnglandOrWalesPage } from '../pages/intestacy/applicant/AdoptedInEnglandOrWalesPage.ts';
import { AnyOtherChildrenPage } from '../pages/intestacy/applicant/AnyOtherChildrenPage.ts';
import { AnyPredeceasedChildrenPage } from '../pages/intestacy/applicant/AnyPredeceasedChildrenPage.ts';
import { AnySurvivingGrandchildrenPage } from '../pages/intestacy/applicant/AnySurvivingGrandchildrenPage.ts';
import { AnyGrandchildrenUnder18Page } from '../pages/intestacy/applicant/AnyGrandchildrenUnder18Page.ts';
import { AllChildrenOver18Page } from '../pages/intestacy/applicant/AllChildrenOver18Page.ts';
import { ApplicantNamePage } from '../pages/intestacy/applicant/ApplicantNamePage.ts';
import { ApplicantPhonePage } from '../pages/intestacy/applicant/ApplicantPhonePage.ts';
import { MainApplicantAddressPage } from '../pages/intestacy/applicant/MainApplicantAddressPage.ts';
import { JointApplicationPage } from '../pages/intestacy/applicant/JointApplicationPage.ts';
import { EqualityAndDiversityPage } from '../pages/common/pcq/EqualityAndDiversityPage.ts';
import { DeclarationPage } from '../pages/summary/DeclarationPage.ts';
import { SummaryDeclarationPage } from '../pages/summary/SummaryDeclarationPage.ts';
import { CopiesUkPage } from '../pages/intestacy/payment/CopiesUKPage.ts';
import { PaymentBreakdownPage } from '../pages/intestacy/payment/PaymentBreakdownPage.ts';
import { CopiesSummaryPage } from '../pages/intestacy/payment/CopiesSummaryPage.ts';
import { CopiesOverseasPage } from '../pages/intestacy/payment/CopiesOverseasPage.ts';
import { AssetsOverseasPage } from '../pages/intestacy/assets/AssetsOverseasPage.ts';
import { CardDetailsPage } from '../pages/intestacy/payment/CardDetailsPage.ts';
import { CardConfirmPage } from '../pages/intestacy/payment/CardConfirmPage.ts';
import { ThankYouPage } from '../pages/common/payment/ThankYouPage.ts';
import { MainApplicantsParentAdoptedInPage } from '../pages/intestacy/applicant/MainApplicantsParentAdoptedInPage.ts';
import { MainApplicantsParentAlivePage } from '../pages/intestacy/applicant/MainApplicantsParentAlivePage.ts';
import { ParentAdoptionPlacePage } from '../pages/intestacy/applicant/ParentAdoptionPlacePage.ts';
import { AllGrandchildrenOver18Page } from '../pages/intestacy/applicant/AllGrandchildrenOver18Page.ts';
import { MainApplicantsParentAnyOtherChildrenPage } from '../pages/intestacy/applicant/MainApplicantsParentAnyOtherChildrenPage.ts';
import { DeceasedAdoptionPlacePage } from '../pages/intestacy/deceased/DeceasedAdoptionPlacePage.ts';
import { DeceasedAdoptedInPage } from '../pages/intestacy/deceased/DeceasedAdoptedInPage.ts';
import { AnyLivingDescendantsPage } from '../pages/intestacy/applicant/AnyLivingDescendantsPage.ts';
import { AnyOtherParentAlivePage } from '../pages/intestacy/applicant/AnyOtherParentAlivePage.ts';
import { DeceasedSameParentsPage } from '../pages/intestacy/applicant/DeceasedSameParentsPage.ts';
import { AnyLivingParentsPage } from '../pages/intestacy/applicant/AnyLivingParentsPage.ts';
import { DeceasedOtherWholeSiblingsPage } from '../pages/intestacy/applicant/DeceasedOtherWholeSiblingsPage.ts';
import { DeceasedWholeSiblingsPage } from '../pages/intestacy/applicant/DeceasedWholeSiblingsPage.ts';
import { WholeSiblingsSurvivingChildrenPage } from '../pages/intestacy/applicant/WholeSiblingsSurvivingChildrenPage.ts';
import { WholeSiblingsAgePage } from '../pages/intestacy/applicant/WholeSiblingsAgePage.ts';
import { WholeNiecesWholeNephewsAgePage } from '../pages/intestacy/applicant/WholeNiecesWholeNephewsAgePage.ts';


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
  anyLivingDescendantsPage: AnyLivingDescendantsPage;
  anyLivingParentsPage: AnyLivingParentsPage;
  anyOtherChildrenPage: AnyOtherChildrenPage;
  deceasedSameParentsPage: DeceasedSameParentsPage;
  anyOtherParentAlivePage: AnyOtherParentAlivePage;
  deceasedAdoptedInPage: DeceasedAdoptedInPage;
  deceasedAdoptionPlacePage: DeceasedAdoptionPlacePage;
  spouseNotApplyingReasonPage: SpouseNotApplyingReasonPage;
  mainApplicantsParentAlivePage: MainApplicantsParentAlivePage;
  mainApplicantsParentAdoptedInPage: MainApplicantsParentAdoptedInPage;
  mainApplicantsParentAnyOtherChildrenPage: MainApplicantsParentAnyOtherChildrenPage;
  allGrandchildrenOver18Page: AllGrandchildrenOver18Page;
  parentAdoptionPlacePage: ParentAdoptionPlacePage;
  mainApplicantAdoptedInPage: MainApplicantAdoptedInPage;
  adoptedInEnglandOrWalesPage: AdoptedInEnglandOrWalesPage;
  deceasedOtherWholeSiblingsPage: DeceasedOtherWholeSiblingsPage;
  deceasedWholeSiblingsPage: DeceasedWholeSiblingsPage;
  wholeSiblingsSurvivingChildrenPage: WholeSiblingsSurvivingChildrenPage;
  wholeNiecesWholeNephewsAgePage: WholeNiecesWholeNephewsAgePage;
  wholeSiblingsAgePage: WholeSiblingsAgePage;

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

  anyLivingDescendantsPage: async ({ page }, use) => {
  await use(new AnyLivingDescendantsPage(page));
},

  anyOtherParentAlivePage: async ({ page }, use) => {
  await use(new AnyOtherParentAlivePage(page));
},

  anyLivingParentsPage: async ({ page }, use) => {
  await use(new AnyLivingParentsPage(page));
},

  deceasedSameParentsPage: async ({ page }, use) => {
  await use(new DeceasedSameParentsPage(page));
},

  deceasedAdoptedInPage: async ({ page }, use) => {
  await use(new DeceasedAdoptedInPage(page));
},

  deceasedAdoptionPlacePage: async ({ page }, use) => {
  await use(new DeceasedAdoptionPlacePage(page));
},

  wholeNiecesWholeNephewsAgePage: async ({ page }, use) => {
    await use(new WholeNiecesWholeNephewsAgePage(page));
  },

  wholeSiblingsAgePage: async ({ page }, use) => {
    await use(new WholeSiblingsAgePage(page));
  },



  spouseNotApplyingReasonPage: async ({ page }, use) => {
    await use(new SpouseNotApplyingReasonPage(page));
  },

  parentAdoptionPlacePage: async ({ page }, use) => {
    await use(new ParentAdoptionPlacePage(page));
  },

  deceasedOtherWholeSiblingsPage: async ({ page }, use) => {
    await use(new DeceasedOtherWholeSiblingsPage(page));
  },

  mainApplicantsParentAlivePage: async ({ page }: { page: Page }, use) => {
  await use(new MainApplicantsParentAlivePage(page));
},

  mainApplicantsParentAdoptedInPage: async ({ page }: { page: Page }, use) => {
  await use(new MainApplicantsParentAdoptedInPage(page));
},

  mainApplicantsParentAnyOtherChildrenPage: async ({ page }, use) => {
  await use(new MainApplicantsParentAnyOtherChildrenPage(page));
},

  allGrandchildrenOver18Page: async ({ page }, use) => {
  await use(new AllGrandchildrenOver18Page(page));
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

  deceasedWholeSiblingsPage: async ({ page }, use) => {
    await use(new DeceasedWholeSiblingsPage(page));
  },

  wholeSiblingsSurvivingChildrenPage: async ({ page }, use) => {
    await use(new WholeSiblingsSurvivingChildrenPage(page));
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
