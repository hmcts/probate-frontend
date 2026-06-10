import { BrowserContext, expect } from '@playwright/test';
import {BasePage, decodeHTML} from '../utility/basePage';
import {getContent} from "../utility/contentHelper.ts";
import {testConfig} from "../../configs/config.ts";

export class CoApplicantNotifyAndDeclarationPage extends BasePage {
  readonly saveAndContinueButtonLocator = this.page.getByRole('button', {name: this.commonContent.saveAndContinue});
  readonly startNowButtonLocator = this.page.getByRole('button', {name: this.commonContent.start});
  readonly continueButtonLocator = this.page.getByRole('button', {name: this.commonContent.continue});
  readonly submitResponseLocator = this.page.getByRole('button', {name: this.commonContent.submitResponse});
  readonly deceasedDodDayLocator = this.page.locator('#dod-date-day');
  readonly deceasedDodMonthLocator = this.page.locator('#dod-date-month');
  readonly deceasedDodYearLocator = this.page.locator('#dod-date-year');

  constructor(page, context: BrowserContext, language: string) {
    super(page, context, language);
  }

  async notifyAdditionalExecutors(language = 'en', question) {
    const content = getContent(`app/resources/${language}/translation/executors/invite.json`);
    await this.checkInUrl('/executors-invite');
    await expect(this.page.getByText(content[`${question}`])).toBeVisible();
    await this.navByClick(this.page.getByRole('button', { name: decodeHTML(content.sendInvites.trim()) }));
  }

  async notificationSent(language = 'en') {
    const taskListContent = getContent(`app/resources/${language}/translation/tasklist.json`);

    await this.checkInUrl('/executors-invites-sent');
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

  async seeCoApplicantStartPage(language = 'en', idList) {
    const content = getContent(`app/resources/${language}/translation/taskList.json`);
    await this.page.goto(`${testConfig.TestFrontendUrl}${testConfig.TestIntestacyInvitationUrl}/${idList}`, {
      waitUntil: 'load',
      timeout: 60000
    });
    await this.checkInUrl('/start-verify');
    await expect(this.page.getByRole('heading', { name: content.header, exact: true })).toBeVisible();
    await this.navByClick(this.startNowButtonLocator);
  }

  async coApplicantDeclarationPage2(deceasedDodDay, deceasedDodMonth, deceasedDodYear) {
    await this.checkInUrl('/verify-dod');
    await expect(this.deceasedDodDayLocator).toBeEnabled();
    await this.deceasedDodDayLocator.fill(deceasedDodDay);
    await this.deceasedDodMonthLocator.fill(deceasedDodMonth);
    await this.deceasedDodYearLocator.fill(deceasedDodYear);
    await this.navByClick(this.continueButtonLocator);
  }

  async agreeDeclaration(answer = null) {
    await this.checkInUrl('/co-applicant-declaration');
    await expect(this.page.locator(`#agreement${answer}`)).toBeEnabled();
    await this.page.locator(`#agreement${answer}`).click();
    await this.navByClick(this.submitResponseLocator);
  }

  async seeAgreePage(language = 'en', journey) {
    const content = getContent(`app/resources/${language}/translation/coapplicant/agreepage.json`);
    await this.checkInUrl(`/${journey}-co-applicant-agree-page`);
    await expect(this.page.getByText(content.subHeader)).toBeVisible();
  }

}
