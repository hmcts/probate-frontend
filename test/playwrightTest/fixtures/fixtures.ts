import {test as baseTest} from '@playwright/test';
import {type PageFixtures, pageFixtures} from './pageFixtures.ts';

export type CustomFixtures = PageFixtures;

export const test = baseTest.extend<CustomFixtures>({
  language: async ({}, use) => {
    const language = String(process.env.TEST_LANGUAGE ?? 'en');
    await use(language);
  },
  ...pageFixtures,
});
