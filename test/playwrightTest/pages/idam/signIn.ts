import { BrowserContext, expect } from '@playwright/test';
import { testConfig } from '../../configs/config.ts';
import { BasePage, decodeHTML } from '../utility/basePage.ts';
import { getContent } from '../utility/contentHelper.ts';

const useIdam = testConfig.TestUseIdam;

export class SignInPage extends BasePage {
  // Keep this if you need it elsewhere, but don't use navByClick for the final sign-in
  readonly signInButtonLocator = this.page.getByRole('button', { name: this.commonContent.signIn });

  readonly usernameLocator = this.page.getByText(this.commonContent.enterEmailAddress);
  readonly passwordLocator = this.page.getByText(this.commonContent.enterPassword);
  readonly usernameTextboxLocator = this.page.getByRole("textbox", {
    name: this.commonContent.enterEmailAddress,
  });
  readonly passwordTextboxLocator = this.page.getByRole("textbox", {
    name: this.commonContent.enterPassword,
  });
  readonly continueButtonLocator = this.page.getByRole("button", {
    name: this.commonContent.continue,
  })
  constructor(page, context: BrowserContext, language: string) {
    super(page, context, language);
  }

  async authenticateWithIdamIfAvailable(language ='en', noScreenerQuestions = false) {
    if (useIdam === 'true') {
      if (noScreenerQuestions) {
        await this.page.goto(`${testConfig.TestFrontendUrl}/?lng=${language}`, {
          waitUntil: 'load',
          timeout: 60000
        });
      }

      await expect(this.page.locator('//*[@name="loginForm" or @id="main-content"]')).toBeVisible();
      const numEls = await this.page.locator('a[href="/sign-out"]').count();
      if (numEls > 0) {
        await this.navByClick(this.page.locator('a[href="/sign-out"]'));
        await this.seeSignOut(language);
        await expect(this.page.locator('//*[@name="loginForm" or @id="main-content"]')).toBeVisible();
        await this.page.goto(`${testConfig.TestFrontendUrl}/?lng=${language}`, {
          waitUntil: 'load',
          timeout: 60000
        });
      }
      await this.verifyPageLoad(this.signInButtonLocator, 10_000);
      await this.navByClick(this.signInButtonLocator);
      await expect(this.usernameLocator).toBeVisible();
      await this.signIn(process.env.testCitizenEmail, process.env.testCitizenPassword);
    }

  }

  private async signIn(username: string, password: string) {
    await this.verifyPageLoad(this.usernameLocator, 10_000);
    await expect(this.usernameLocator).toBeVisible();

    await this.usernameTextboxLocator.fill(username);
    await this.continueButtonLocator.click();

    await expect(this.passwordLocator).toBeVisible();
    await this.passwordTextboxLocator.fill(password);

    await this.navByClick(this.continueButtonLocator);

    await expect(this.passwordLocator).toBeHidden();
  }

  async seeSignOut(language = 'en') {
    const signOutContent = getContent(`app/resources/${language}/translation/signout.json`);
    await this.checkInUrl('/sign-out');
    await expect(this.page.getByText(decodeHTML(signOutContent.header))).toBeVisible();
    await expect(this.page.locator('#main-content > div > div > p:nth-child(3) > a')).toBeEnabled();
    await this.navByClick(this.page.locator('#main-content > div > div > p:nth-child(3) > a'));
  }
}
