import {SignInPage} from '../pages/idam/signIn.ts';
import {IntestacyScreenerPage} from '../pages/screener/intestacyScreenerPage.ts';
import {GopScreenerPage} from '../pages/screener/gopScreenerPage.ts';
import {TaskListPage} from '../pages/taskListPage.ts';
import {DeceasedDetailsSection} from '../pages/deceasedDetails/deceasedDetailsSection.ts';
import {ApplicantDetailsSection} from '../pages/applicantDetails/applicantDetailsSection.ts';
import {ExecutorDetailsSection} from '../pages/applicantDetails/executorDetailsSection.ts';
import {CoApplicantNotifyAndDeclarationPage} from '../pages/applicantDetails/coApplicantNotifyAndDeclarationPage.ts';
import {CyaAndDeclarationSection} from '../pages/cyaAndDeclarationSection/cyaAndDeclarationSection.ts'
import {PaymentTaskSection} from '../pages/paymentSection/paymentTaskPage.ts'

export interface PageFixtures {
  language: string;
  intestacyScreenerPage: IntestacyScreenerPage;
  gopScreenerPage: GopScreenerPage;
  signInPage: SignInPage;
  taskListPage: TaskListPage;
  deceasedDetailsPage: DeceasedDetailsSection;
  applicantDetailsPage: ApplicantDetailsSection;
  executorDetailsPage: ExecutorDetailsSection;
  coApplicantNotifyAndDeclarationPage: CoApplicantNotifyAndDeclarationPage;
  cyaAndDeclarationPage: CyaAndDeclarationSection;
  paymentTaskPage: PaymentTaskSection;
}

export const pageFixtures = {
  intestacyScreenerPage: async ({ page, context, language }, use) => {
    await use(new IntestacyScreenerPage(page, context, language));
  },
  gopScreenerPage: async ({ page, context, language }, use) => {
    await use(new GopScreenerPage(page, context, language));
  },
  signInPage: async ({ page, context, language }, use) => {
    await use(new SignInPage(page, context, language));
  },
  taskListPage: async ({ page, context, language }, use) => {
    await use(new TaskListPage(page, context, language));
  },
  deceasedDetailsPage: async ({ page, context, language }, use) => {
    await use(new DeceasedDetailsSection(page, context, language));
  },
  applicantDetailsPage: async ({ page, context, language }, use) => {
    await use(new ApplicantDetailsSection(page, context, language));
  },
  executorDetailsPage: async ({ page, context, language, applicantDetailsPage }, use) => {
    await use(new ExecutorDetailsSection(page, context, language, applicantDetailsPage));
  },
  coApplicantNotifyAndDeclarationPage: async ({ page, context, language }, use) => {
    await use(new CoApplicantNotifyAndDeclarationPage(page, context, language));
  },
  cyaAndDeclarationPage: async ({ page, context, language }, use) => {
    await use(new CyaAndDeclarationSection(page, context, language));
  },
  paymentTaskPage: async ({ page, context, language }, use) => {
    await use(new PaymentTaskSection(page, context, language));
  },
};
