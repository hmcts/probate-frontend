import { BrowserContext, expect } from '@playwright/test';
import {BasePage, decodeHTML} from '../utility/basePage';
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
  }

  async selectEnglishForeignDeathCert(language = 'en', answer = null) {
    const englishForeignDeathCertContent = getContent(`app/resources/${language}/translation/deceased/englishforeigndeathcert.json`);
    await this.checkInUrl('/intestacy/english-foreign-death-cert');
    await expect(this.page.getByText(await decodeHTML(englishForeignDeathCertContent.question))).toBeVisible();
    await expect(this.page.locator(`#englishForeignDeathCert${answer}`)).toBeEnabled();
    await this.page.locator(`#englishForeignDeathCert${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectForeignDeathCertTranslation(language = 'en', answer = null) {
    const foreignDeathCertTranslationContent = getContent(`app/resources/${language}/translation/deceased/foreigndeathcerttranslation.json`);
    await this.checkInUrl('/intestacy/foreign-death-cert-translation');
    await expect(this.page.getByText(await decodeHTML(foreignDeathCertTranslationContent.question))).toBeVisible();
    await expect(this.page.locator(`#foreignDeathCertTranslation${answer}`)).toBeEnabled();
    await this.page.locator(`#foreignDeathCertTranslation${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectEEComplete(answer = null) {
    await this.checkInUrl('/intestacy/calc-check');
    await expect(this.page.locator(`#calcCheckCompleted${answer}`)).toBeEnabled();
    await this.page.locator(`#calcCheckCompleted${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectSubmittedToHmrc(answer = null) {
    await this.checkInUrl('/intestacy/new-submitted-to-hmrc');
    await expect(this.page.locator(`#estateValueCompleted${answer}`)).toBeEnabled();
    await this.page.locator(`#estateValueCompleted${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectHmrcLetterComplete(answer = null) {
    await this.checkInUrl('/intestacy/hmrc-letter');
    await expect(this.page.locator(`#hmrcLetterId${answer}`)).toBeEnabled();
    await this.page.locator(`#hmrcLetterId${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterHmrcCode(hmrcCode = null) {
    await this.checkInUrl('/intestacy/unique-probate-code');
    await expect(this.page.locator('#uniqueProbateCodeId')).toBeEnabled();
    await this.page.locator('#uniqueProbateCodeId').fill(hmrcCode);
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterProbateAssetValues(grossValue = null, netValue = null) {
    await this.checkInUrl('/intestacy/probate-estate-values');
    await expect(this.page.locator('#grossValueField')).toBeEnabled();
    await this.page.locator('#grossValueField').fill(grossValue);
    await this.page.locator('#netValueField').fill(netValue);
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectAssetsOutsideEnglandWales(language = 'en', answer = null) {
    const assetsContent = getContent(`app/resources/${language}/translation/iht/assetsoutside.json`);
    await this.checkInUrl('/intestacy/assets-outside-england-wales');
    await expect(this.page.getByText(await decodeHTML(assetsContent.hint))).toBeVisible();
    await expect(this.page.locator(`#assetsOutside${answer}`)).toBeEnabled();
    await this.page.locator(`#assetsOutside${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
    // const I = this;
    // const commonContent = require(`app/resources/${language}/translation/common`);
    // const assetsContent = require(`app/resources/${language}/translation/iht/assetsoutside`);

    // await I.checkInUrl('/assets-outside-england-wales');
    // await I.waitForText(assetsContent.hint, config.TestWaitForTextToAppear);
    // const locator = {css: `#assetsOutside ${answer}`};
    // await I.waitForEnabled(locator);
    // await I.click(locator);
    // await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
  }

  async enterValueAssetsOutsideEnglandWales(netAmount = null) {
    await this.checkInUrl('/intestacy/value-assets-outside-england-wales');
    await expect(this.page.locator('#netValueAssetsOutsideField')).toBeEnabled();
    await this.page.locator('#netValueAssetsOutsideField').fill(netAmount);
    await this.navByClick(this.saveAndContinueButtonLocator);
    // const I = this;
    // const commonContent = require(`app/resources/${language}/translation/common`);

    // await I.checkInUrl('/value-assets-outside-england-wales');
    // const locator = {css: '#netValueAssetsOutsideField'};
    // await I.waitForEnabled(locator);
    // await I.fillField(locator, netAmount);

    // await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
  }

  async selectDeceasedAlias(language = 'en', answer = null) {
    const aliasContent = getContent(`app/resources/${language}/translation/deceased/alias.json`);
    await this.checkInUrl('/intestacy/deceased-alias');
    await expect(this.page.getByText(await decodeHTML(aliasContent.intestacyParagraph1
      .replace('{deceasedName}', 'Deceased First Name Deceased Last Name'))))
      .toBeVisible();
    await expect(this.page.locator(`#alias${answer}`)).toBeEnabled();
    await this.page.locator(`#alias${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
    // const I = this;

    // const commonContent = require(`app/resources/${language}/translation/common`);
    // const aliasContent = require(`app/resources/${language}/translation/deceased/alias`);

    // await I.checkInUrl('/deceased-alias');
    // await I.waitForText(aliasContent.intestacyParagraph1.replace('{deceasedName}', 'Deceased First Name Deceased Last Name'), config.TestWaitForTextToAppear);
    // const locator = {css: `#alias${answer}`};
    // await I.waitForEnabled(locator);
    // await I.click(locator);

    // await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
  }

  async selectDeceasedMaritalStatus(answer = null) {
    await this.checkInUrl('/intestacy/deceased-marital-status');
    await expect(this.page.locator(`#maritalStatus${answer}`)).toBeEnabled();
    await this.page.locator(`#maritalStatus${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
    // const I = this;
    // const commonContent = require(`app/resources/${language}/translation/common`);

    // await I.checkInUrl('/deceased-marital-status');
    // const locator = {css: `#maritalStatus${answer}`};

    // await I.waitForEnabled(locator);
    // await I.click(locator);
    // await I.navByClick(commonContent.saveAndContinue, 'button.govuk-button');
  }
}
