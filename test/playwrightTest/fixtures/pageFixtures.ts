import {SignInPage} from '../pages/signIn';

export interface PageFixtures {
  signInPage: SignInPage;
}

export const pageFixtures = {
    signInPage: async ({page}, use) => {
        await use(new SignInPage(page));
    },
};
