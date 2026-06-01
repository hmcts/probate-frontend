import { test as baseTest } from '@playwright/test';
import { type PageFixtures, pageFixtures } from './pageFixtures.ts';

export type CustomFixtures = PageFixtures & {
  language: string;
};

export const test = baseTest.extend<CustomFixtures>({
  language: [String(process.env.TEST_LANGUAGE ?? 'en'), { option: true }],
  ...pageFixtures,
});
