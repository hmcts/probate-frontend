import { BrowserContext, expect } from '@playwright/test';
import {BasePage, decodeHTML} from '../utility/basePage';
import {getContent} from "../utility/contentHelper.ts";
import ihtDataConfig from '../../data/ee/ihtData.json';
import config from "config";
import applicantDetailsConfig from '../../data/intestacy/sole/applicantDetails.json';
const optionYes = ihtDataConfig.optionYes;
const optionNo = ihtDataConfig.optionNo;
const equalityEn = 'Equality and diversity questions';
const equalityCy = 'Cwestiynau am Gydraddoldeb ac Amrywiaeth';

export class ApplicantDetailsSection extends BasePage {
  readonly saveAndContinueButtonLocator = this.page.getByRole('button', {name: this.commonContent.saveAndContinue});
  readonly firstNameLocator = this.page.locator('#firstName');
  readonly lastNameLocator = this.page.locator('#lastName');

  constructor(page, context: BrowserContext, language: string) {
    super(page, context, language);
  }

  async selectRelationshipToDeceased(language = 'en', answer = null, deceasedName = null) {
    const relationshipContent = getContent(`app/resources/${language}/translation/applicant/relationshiptodeceased.json`);
    await this.checkInUrl('intestacy/relationship-to-deceased');
    await expect(this.page.getByText(await decodeHTML(relationshipContent.question)
      .replace('{deceasedName}', deceasedName)))
      .toBeVisible();
    await expect(this.page.locator(`#relationshipToDeceased${answer}`)).toBeEnabled();
    await this.page.locator(`#relationshipToDeceased${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterAnyChildren(language = 'en', answer = null) {
    const childrenContent = getContent(`app/resources/${language}/translation/deceased/anychildren.json`);
    await this.checkInUrl('/intestacy/any-children');
    await expect(this.page.getByText(await decodeHTML(childrenContent.hint))).toBeVisible();
    await expect(this.page.locator(`#anyChildren${answer}`)).toBeEnabled();
    await this.page.locator(`#anyChildren${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterApplicantName(language ='en', firstname = null, lastname = null) {
    const nameContent = getContent(`app/resources/${language}/translation/applicant/name.json`);
    await this.checkInUrl('/intestacy/applicant-name');
    await expect(this.page.getByText(await decodeHTML(nameContent.question))).toBeVisible();
    await expect(this.firstNameLocator).toBeEnabled();
    await this.firstNameLocator.fill(firstname);
    await this.lastNameLocator.fill(lastname);
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterApplicantPhone(language = 'en') {
    const phoneContent = getContent(`app/resources/${language}/translation/applicant/phone.json`);
    const phoneNumberLabel = await decodeHTML(phoneContent.phoneNumber);
    await this.checkInUrl('/intestacy/applicant-phone');
    await expect(this.page.locator('label', { hasText: phoneNumberLabel })).toBeVisible();
    await expect(this.page.locator('#phoneNumber')).toBeEnabled();
    await this.page.locator('#phoneNumber').fill(applicantDetailsConfig.phoneNumberValue);
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterAddressManually() {
    await this.checkInUrl('/intestacy/applicant-address');
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

  async exitEqualityAndDiversity (language ='en') {
    const equalityContent = language === 'en' ? equalityEn : equalityCy;
    await this.checkInUrl('pcq');
    await expect(this.page.locator('#back-button')).toBeVisible();
    await this.page.reload();
    await expect(this.page.locator('#back-button')).toBeVisible();
    const currentUrl = await this.page.url();
    if (!currentUrl.includes('/offline')) {
      await expect(this.page.getByText(equalityContent).nth(1)).toBeVisible();
    }
    await this.page.locator('#back-button').click();
  }

  async completeEqualityAndDiversity() {
    if (this.page.url().includes('pcq')) {
      await this.page.waitForTimeout(300);
      await expect(this.saveAndContinueButtonLocator).toBeVisible();
      await this.page.reload();
    }

    await expect(this.saveAndContinueButtonLocator).toBeVisible();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }
}
