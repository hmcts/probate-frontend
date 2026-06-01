import { BrowserContext, expect } from '@playwright/test';
import {BasePage} from '../utility/basePage';
import {getContent} from "../utility/contentHelper.ts";
import ihtDataConfig from '../../data/ee/ihtData.json';
import config from "config";
const optionYes = ihtDataConfig.optionYes;
const optionNo = ihtDataConfig.optionNo;

export class DeceasedDetailsSection extends BasePage {
  readonly saveAndContinueButtonLocator = this.page.getByRole('button', { name: this.commonContent.saveAndContinue });
  readonly firstNameLocator = this.page.locator('#firstName');
  readonly lastNameLocator = this.page.locator('#lastName');
  readonly dobDayLocator = this.page.locator('#dob-date-day');
  readonly dobMonthLocator = this.page.locator('#dob-date-month');
  readonly dobYearLocator = this.page.locator('#dob-date-year');
  readonly dodDayLocator = this.page.locator('#dod-date-day');
  readonly dodMonthLocator = this.page.locator('#dod-date-month');
  readonly dodYearLocator = this.page.locator('#dod-date-year');

  constructor(page, context: BrowserContext, language: string) {
    super(page, context, language);
  }

  async chooseBiLingualGrant(answer = null) {
    const otherAnswer = answer === optionYes ? optionNo : optionYes;
    await this.checkInUrl('/bilingual-gop');
    await expect(this.page.locator(`#bilingual${answer}`)).toBeEnabled();
    await expect(this.page.locator(`#bilingual${answer}`)).not.toBeChecked();
    await expect(this.page.locator(`#bilingual${otherAnswer}`)).not.toBeChecked();
    await this.page.locator(`#bilingual${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterDeceasedDetails(firstName = null, lastName = null) {
    await this.checkInUrl('/intestacy/deceased-name');
    await expect(this.firstNameLocator).toBeEnabled();
    await this.firstNameLocator.fill(firstName);
    await this.lastNameLocator.fill(lastName);
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterDobDetails(dob_day = null, dob_month = null, dob_year = null) {
    await this.checkInUrl('/intestacy/deceased-dob');
    await expect(this.dobDayLocator).toBeEnabled();
    await this.dobDayLocator.fill(dob_day);
    await this.dobMonthLocator.fill(dob_month);
    await this.dobYearLocator.fill(dob_year);
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterDodDetails(dod_day = null, dod_month = null, dod_year = null) {
    await this.checkInUrl('/intestacy/deceased-dod');
    await expect(this.dodDayLocator).toBeEnabled();
    await this.dodDayLocator.fill(dod_day);
    await this.dodMonthLocator.fill(dod_month);
    await this.dodYearLocator.fill(dod_year);
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterDeceasedAddress() {
    await this.checkInUrl('/intestacy/deceased-address');
    await this.page.locator('#details-panel > summary > span').click();
    await expect(this.page.locator('#addressLine1')).toBeEnabled();
    await this.page.locator('#addressLine1').fill('Deceased Address Line 1');
    await this.page.locator('#addressLine2').fill('Deceased Address Line 2');
    await this.page.locator('#addressLine3').fill('Deceased Address Line 3');
    await this.page.locator('#postTown').fill('Deceased Post Town');
    await this.page.locator('#newPostCode').fill('AA1 1AA');
    await this.page.locator('#country').fill('United Kingdom');
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectDiedEngOrWales(answer = null) {
    await this.checkInUrl('/intestacy/died-eng-or-wales');
    await expect(this.page.locator(`#diedEngOrWales${answer}`)).toBeEnabled();
    await this.page.locator(`#diedEngOrWales${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
    // const I = this;
    // const commonContent = require(`app/resources/${language}/translation/common`);

    // await I.checkInUrl('/died-eng-or-wales');
    // const locator = {css: `#diedEngOrWales${answer}`};
    // await I.waitForEnabled(locator);
    // await I.click(locator);
    // await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
  }

  async selectEnglishForeignDeathCert(language = 'en', answer = null) {
    const englishForeignDeathCertContent = getContent(`app/resources/${language}/translation/deceased/englishforeigndeathcert.json`);
    await this.checkInUrl('/intestacy/english-foreign-death-cert');
    await expect(this.page.getByText(englishForeignDeathCertContent.question)).toBeVisible();
    await expect(this.page.locator(`#englishForeignDeathCert${answer}`)).toBeEnabled();
    await this.page.locator(`#englishForeignDeathCert${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
    // const I = this;
    // const commonContent = require(`app/resources/${language}/translation/common`);
    // const englishForeignDeathCertContent = require(`app/resources/${language}/translation/deceased/englishforeigndeathcert`);

    // await I.checkInUrl('/english-foreign-death-cert');
    // await I.waitForText(englishForeignDeathCertContent.question, config.TestWaitForTextToAppear);

    // const locator = `#englishForeignDeathCert${answer}`;
    // await I.waitForEnabled(locator);
    // await I.click(locator);
    // await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
  }

  async selectForeignDeathCertTranslation(language = 'en', answer = null) {
    const foreignDeathCertTranslationContent = getContent(`app/resources/${language}/translation/deceased/foreigndeathcerttranslation.json`);
    await this.checkInUrl('/intestacy/foreign-death-cert-translation');
    await expect(this.page.getByText(foreignDeathCertTranslationContent.question)).toBeVisible();
    await expect(this.page.locator(`#foreignDeathCertTranslation${answer}`)).toBeEnabled();
    await this.page.locator(`#foreignDeathCertTranslation${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
    // const I = this;
    // const commonContent = require(`app/resources/${language}/translation/common`);
    // const foreignDeathCertTranslationContent = require(`app/resources/${language}/translation/deceased/foreigndeathcerttranslation`);

    // await I.checkInUrl('/foreign-death-cert-translation');
    // await I.waitForText(foreignDeathCertTranslationContent.question, config.TestWaitForTextToAppear);

    // const locator = {css: `#foreignDeathCertTranslation${answer}`};
    // await I.waitForEnabled(locator);
    // await I.click(locator);

    // await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
  }
}
