import { BrowserContext, expect } from '@playwright/test';
import {BasePage, decodeHTML} from '../utility/basePage.ts';
import {getContent} from "../utility/contentHelper.ts";
import {testConfig} from "../../configs/config.ts";

export class CoApplicantNotifyAndDeclarationPage extends BasePage {
  readonly saveAndContinueButtonLocator = this.page.getByRole('button', {name: this.commonContent.saveAndContinue});
  readonly startNowButtonLocator = this.page.getByRole('button', {name: this.commonContent.start});
  readonly signInButtonLocator = this.page.getByRole('button', {name: this.commonContent.signIn});
  readonly continueButtonLocator = this.page.getByRole('button', {name: this.commonContent.continue});
  readonly submitResponseLocator = this.page.getByRole('button', {name: this.commonContent.submitResponse});
  readonly deceasedDodDayLocator = this.page.locator('#dod-date-day');
  readonly deceasedDodMonthLocator = this.page.locator('#dod-date-month');
  readonly deceasedDodYearLocator = this.page.locator('#dod-date-year');

  constructor(page, context: BrowserContext, language: string) {
    super(page, context, language);
  }

  async notifyAdditionalExecutors(language = 'en', question = 'question') {
    const content = getContent(`app/resources/${language}/translation/executors/invite.json`);
    await this.checkInUrl('/executors-invite');
    await expect(this.page.getByText(decodeHTML(content[`${question}`]))).toBeVisible();
    await this.navByClick(this.page.getByRole('button', { name: decodeHTML(content.sendInvites.trim()) }));
  }

  async notificationSent(language = 'en') {
    const taskListContent = getContent(`app/resources/${language}/translation/tasklist.json`);

    await this.checkInUrl('/executors-invites-sent');
    await this.runAccessibilityTest();
    await this.navByClick(this.saveAndContinueButtonLocator);
    await expect(this.page.getByText(taskListContent.introduction)).toBeVisible();
  }

  async getIdList() {
    await this.page.goto(`${testConfig.TestFrontendUrl}${testConfig.TestInviteIdListUrl}`, {
      waitUntil: 'load',
      timeout: 60000
    });
    await expect(this.page.getByText('ids')).toBeVisible();
    return await this.page.getByText('ids').innerText();
  }

  async seeCoExecutorLaunchPage(idList) {
    await this.page.waitForTimeout(200);
    await this.page.goto(`${testConfig.TestFrontendUrl}${testConfig.TestInvitationUrl}/${idList}`, {
      waitUntil: 'load',
      timeout: 60000
    });
    await expect(this.page.locator('//*[@name="loginForm" or @id="main-content"]')).toBeEnabled();
    await this.page.goto(`${testConfig.TestFrontendUrl}/pin`, {
      waitUntil: 'load',
      timeout: 60000
    });
    await expect(this.page.getByText('pin')).toBeVisible();
    const grabPins = await this.page.getByText('pin').innerText();
    const pinList = JSON.parse(grabPins);

    await this.page.goBack();

    await this.enterPinCode(pinList.pin.toString());
  }

  async enterPinCode(pinCode) {
    await this.checkInUrl('/sign-in');
    await expect(this.page.locator('#pin')).toBeEnabled();
    await this.page.locator('#pin').fill(pinCode);
    await this.runAccessibilityTest();
    await this.navByClick(this.signInButtonLocator);
  }

  async seeCoApplicantStartPage(language = 'en', idList) {
    const content = getContent(`app/resources/${language}/translation/tasklist.json`);
    const pageUrl = `${testConfig.TestFrontendUrl}${testConfig.TestIntestacyInvitationUrl}/${idList}`;
    await this.page.goto( `${pageUrl}`, {
      waitUntil: 'load',
      timeout: 60000
    });
    console.log(`Invite URL: ${pageUrl}`);
    await this.checkInUrl('/start-verify');
    await expect(this.page.getByRole('heading', { name: content.header, exact: true })).toBeVisible();
    await this.runAccessibilityTest();
    await this.navByClick(this.startNowButtonLocator);
  }

  async seeCoExecutorStartPage(language = 'en') {
    const content = getContent(`app/resources/${language}/translation/coapplicant/startpage.json`);
    await this.checkInUrl('/co-applicant-start-page');
    await expect(this.page.getByRole('heading', { name: content.subHeader1, exact: true })).toBeVisible();
    await this.runAccessibilityTest();
    await this.navByClick(this.startNowButtonLocator);
  }

  async coApplicantDeclarationPage2(deceasedDodDay, deceasedDodMonth, deceasedDodYear) {
    await this.checkInUrl('/verify-dod');
    await expect(this.deceasedDodDayLocator).toBeEnabled();
    await this.deceasedDodDayLocator.fill(deceasedDodDay);
    await this.deceasedDodMonthLocator.fill(deceasedDodMonth);
    await this.deceasedDodYearLocator.fill(deceasedDodYear);
    await this.runAccessibilityTest();
    await this.navByClick(this.continueButtonLocator);
  }

  async agreeDeclaration(answer = null) {
    await this.checkInUrl('/co-applicant-declaration');
    await expect(this.page.locator(`#agreement${answer}`)).toBeEnabled();
    await this.page.locator(`#agreement${answer}`).click();
    await this.runAccessibilityTest();
    await this.navByClick(this.submitResponseLocator);
  }

  async seeAgreePage(language = 'en', journey = '') {
    const content = getContent(`app/resources/${language}/translation/coapplicant/agreepage.json`);
    if (journey !== '') {
      journey = `${journey}-`;
    }
    await this.checkInUrl(`/${journey}co-applicant-agree-page`);
    await expect(this.page.getByText(content.subHeader)).toBeVisible();
  }

}
