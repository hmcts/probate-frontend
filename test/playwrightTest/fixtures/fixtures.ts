import {test as baseTest} from '@playwright/test';
import {PageFixtures, pageFixtures} from './pageFixtures';

export type CustomFixtures = PageFixtures;

export const test = baseTest.extend<CustomFixtures>({
    ...pageFixtures,
});
