import type { BrowserContext, Page } from '@playwright/test';
import { SignInPage } from '../pages/idam/signIn.ts';
import { IntestacyScreenerPage } from '../pages/screener/intestacyScreenerPage.ts';
import { TaskListPage } from '../pages/taskListPage.ts';
import { DeceasedDetailsSection } from '../pages/deceasedDetails/deceasedDetailsSection.ts';
import { BilingualGopPage } from '../pages/deceasedDetails/bilingualGopPage.ts';
import { ApplicantDetailsSection } from '../pages/applicant/applicantDetailsSection.ts';
import { EqualityAndDiversityPage } from '../pages/equalityAndDiversityPage.ts';
import { DeclarationPage } from '../pages/declaration/declarationPage.ts';

type FixtureDeps = {
  page: Page;
  context: BrowserContext;
  language: string;
};

type UseFixture<T> = (value: T) => Promise<void>;

export interface PageFixtures {
  intestacyScreenerPage: IntestacyScreenerPage;
  signInPage: SignInPage;
  taskListPage: TaskListPage;
  deceasedDetailsPage: DeceasedDetailsSection;
  bilingualGopPage: BilingualGopPage;
  applicantsPage: ApplicantDetailsSection;
  equalityAndDiversityPage: EqualityAndDiversityPage;
  declarationPage: DeclarationPage;
}

export const pageFixtures = {
  intestacyScreenerPage: async (
    { page, context, language }: FixtureDeps,
    use: UseFixture<IntestacyScreenerPage>,
  ) => {
    await use(new IntestacyScreenerPage(page, context, language));
  },

  signInPage: async (
    { page, context, language }: FixtureDeps,
    use: UseFixture<SignInPage>,
  ) => {
    await use(new SignInPage(page, context, language));
  },

  taskListPage: async (
    { page, context, language }: FixtureDeps,
    use: UseFixture<TaskListPage>,
  ) => {
    await use(new TaskListPage(page, context, language));
  },

  deceasedDetailsPage: async (
    { page, context, language }: FixtureDeps,
    use: UseFixture<DeceasedDetailsSection>,
  ) => {
    await use(new DeceasedDetailsSection(page, context, language));
  },

  bilingualGopPage: async (
    { page, context, language }: FixtureDeps,
    use: UseFixture<BilingualGopPage>,
  ) => {
    await use(new BilingualGopPage(page, context, language));
  },

  applicantsPage: async (
    { page, context, language }: FixtureDeps,
    use: UseFixture<ApplicantDetailsSection>,
  ) => {
    await use(new ApplicantDetailsSection(page, context, language));
  },

  equalityAndDiversityPage: async (
  { page, context, language }: FixtureDeps,
  use: UseFixture<EqualityAndDiversityPage>,
) => {
  await use(new EqualityAndDiversityPage(page));
},

declarationPage: async (
  { page, context, language }: FixtureDeps,
  use: UseFixture<DeclarationPage>,
) => {
  await use(new DeclarationPage(page));
},

};
