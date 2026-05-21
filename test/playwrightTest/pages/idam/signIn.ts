import {BrowserContext, expect} from '@playwright/test';
import {testConfig} from '../../configs/config.ts';
import {BasePage} from '../utility/basePage.ts';
import {getContent} from "../utility/contentHelper.ts";

const useIdam = testConfig.TestUseIdam;

export class SignInPage extends BasePage {
  readonly submitButtonLocator = this.page.getByRole('button', { name: this.commonContent.submitOnly });
  readonly signInButtonLocator = this.page.getByRole('button', { name: this.commonContent.signIn });
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
        // await I.amOnLoadedPage('/', language);
      }

      await expect(this.page.locator('//*[@name="loginForm" or @id="main-content"]')).toBeVisible();
      const numEls = await this.page.locator('a[href="/sign-out"]').count();

      // const signInOrProbatePageLocator = {xpath: '//*[@name="loginForm" or @id="main-content"]'};
      // await I.waitForElement(signInOrProbatePageLocator, testConfig.TestWaitForTextToAppear);
      // const locator = {css: 'a[href="/sign-out"]'};
      // const numEls = await I.grabNumberOfVisibleElements(locator);
      if (numEls > 0) {
        await this.navByClick(this.page.locator('a[href="/sign-out"]'));
        await this.seeSignOut(language);
        await expect(this.page.locator('//*[@name="loginForm" or @id="main-content"]')).toBeVisible();
        // await I.navByClick(locator);
        // await I.seeSignOut(language);
      }
      await this.page.locator('#username').fill(process.env.testCitizenEmail);
      await this.page.locator('#password').fill(process.env.testCitizenPassword);
      await this.navByClick(this.signInButtonLocator);
      // await I.fillField({css: '#username'}, process.env.testCitizenEmail);
      // await I.fillField({css: '#password'}, process.env.testCitizenPassword);
      // await I.navByClick({css: 'input.button[type="submit"]'});
    }

  }

  async seeSignOut(language = 'en') {
    const signOutContent = getContent(`app/resources/${language}/translation/signout.json`);
    await this.checkInUrl('/sign-out');
    await expect(this.page.getByText(signOutContent.header)).toBeVisible();
    await expect(this.page.locator('#main-content > div > div > p:nth-child(3) > a')).toBeEnabled();
    await this.navByClick(this.page.locator('#main-content > div > div > p:nth-child(3) > a'));
    // const I = this;
    // const signOutContent = require(`app/resources/${language}/translation/signout`);

    // await I.checkInUrl('/sign-out');
    // await I.waitForText(signOutContent.header, testConfig.TestWaitForTextToAppear);
    // const locator = {css: '#main-content > div > div > p:nth-child(3) > a'};
    // await I.waitForElement(locator);
    // await I.navByClick(locator);
  }
}
