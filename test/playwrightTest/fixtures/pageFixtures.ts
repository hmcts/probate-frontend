import {SignInPage} from '../pages/idam/signIn.ts';
import {IntestacyScreenerPage} from '../pages/screener/intestacyScreenerPage.ts';
import {TaskListPage} from '../pages/taskListPage.ts';
import {DeceasedDetailsSection} from '../pages/deceasedDetails/deceasedDetailsSection.ts';
import {ApplicantDetailsSection} from '../pages/applicantDetails/applicantDetailsSection.ts';

export interface PageFixtures {
  language: string;
  intestacyScreenerPage: IntestacyScreenerPage;
  signInPage: SignInPage;
  taskListPage: TaskListPage;
  deceasedDetailsPage: DeceasedDetailsSection;
  applicantDetailsPage: ApplicantDetailsSection;
}

export const pageFixtures = {
  intestacyScreenerPage: async ({ page, context, language }, use) => {
    await use(new IntestacyScreenerPage(page, context, language));
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
};
