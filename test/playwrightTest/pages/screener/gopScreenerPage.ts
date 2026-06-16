import { BrowserContext, expect } from "@playwright/test";
import { BasePage } from "../utility/basePage.ts";
import { getContent } from '../utility/contentHelper.ts';
import { decodeHTML } from "../utility/basePage.ts";

export class GopScreenerPage extends BasePage {
  readonly continueButtonLocator = this.page.getByRole('button', {name: this.commonContent.continue});

  constructor(page, context: BrowserContext, language: string) {
    super(page, context, language);
  }

  async selectOriginalWill(language ='en', answer = null) {
    const willOriginalContent = getContent(`app/resources/${language}/translation/screeners/willoriginal.json`);
    await this.checkInUrl('/will-original');
    await expect(this.page.getByText(await decodeHTML(willOriginalContent.question))).toBeVisible();
    await expect(this.page.locator(`#original${answer}`)).toBeEnabled();
    await this.page.locator(`#original${answer}`).click();
    await this.navByClick(this.continueButtonLocator);
    // const I = this;
    // const commonContent = require(`app/resources/${language}/translation/common`);
    // const willOriginalContent = require(`app/resources/${language}/translation/screeners/willoriginal`);
    // const {decodeHTML} = require('test/end-to-end/helpers/GeneralHelpers');

    // await I.checkInUrl('/will-original');
    // await I.waitForText(await decodeHTML(willOriginalContent.question));
    // const locator = {css: `#original${answer}`};
    // await I.waitForEnabled(locator);
    // await I.click(locator);
    // await I.navByClick(commonContent.continue, 'button.govuk-button');
  }

  async selectApplicantIsExecutor(language ='en', answer = null) {
    const applicantExecutorContent = getContent(`app/resources/${language}/translation/screeners/applicantexecutor.json`);
    await this.checkInUrl('/applicant-executor');
    await expect(this.page.getByText(await decodeHTML(applicantExecutorContent.question))).toBeVisible();
    await expect(this.page.getByText(await decodeHTML(applicantExecutorContent.hintText1))).toBeVisible();
    await expect(this.page.locator(`#executor${answer}`)).toBeEnabled();
    await this.page.locator(`#executor${answer}`).click();
    await this.navByClick(this.continueButtonLocator);
    // const I = this;
    // const commonContent = require(`app/resources/${language}/translation/common`);
    // const applicantExecutorContent = require(`app/resources/${language}/translation/screeners/applicantexecutor`);
    // const {decodeHTML} = require('test/end-to-end/helpers/GeneralHelpers');

    // await I.checkInUrl('/applicant-executor');
    // await I.waitForText(await decodeHTML(applicantExecutorContent.question));
    // await I.waitForText(await decodeHTML(applicantExecutorContent.hintText1));

    // const locator = {css: `#executor${answer}`};
    // await I.waitForEnabled(locator);
    // await I.click(locator);
    // await I.navByClick(commonContent.continue, 'button.govuk-button');
  }

  async selectMentallyCapable(language ='en', answer = null) {
    const mentalCapacityContent = getContent(`app/resources/${language}/translation/screeners/mentalcapacity.json`);
    await this.checkInUrl('/mental-capacity');
    await expect(this.page.getByText(await decodeHTML(mentalCapacityContent.question))).toBeVisible();
    await expect(this.page.getByText(await decodeHTML(mentalCapacityContent.hintText1))).toBeVisible();
    await expect(this.page.locator(`#mentalCapacity${answer}`)).toBeEnabled();
    await this.page.locator(`#mentalCapacity${answer}`).click();
    await this.navByClick(this.continueButtonLocator);
    // const I = this;
    // const commonContent = require(`app/resources/${language}/translation/common`);
    // const mentalCapacityContent = require(`app/resources/${language}/translation/screeners/mentalcapacity`);
    // const {decodeHTML} = require('test/end-to-end/helpers/GeneralHelpers');
    // await I.checkInUrl('/mental-capacity');
    // await I.waitForText(await decodeHTML(mentalCapacityContent.question));
    // await I.see(await decodeHTML(mentalCapacityContent.hintText1));

    // const locator = {css: `#mentalCapacity${answer}`};
    // await I.waitForEnabled(locator);
    // await I.click(locator);
    // await I.navByClick(commonContent.continue, 'button.govuk-button');
  }

}
