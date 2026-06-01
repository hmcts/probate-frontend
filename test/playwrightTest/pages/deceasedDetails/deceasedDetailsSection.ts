import { BrowserContext, expect, type Page } from '@playwright/test';
import { BasePage } from '../utility/basePage.ts';
import { ROUTES } from '../../pageUrl/routes.ts';

export class DeceasedDetailsSection extends BasePage {
  constructor(page: Page, context: BrowserContext, language: string) {
    super(page, context, language);
  }

  async selectBilingualGrant(option: string): Promise<void> {
    await this.selectRadioByIdAndContinue(option, ROUTES.intestacyDeceasedName);
  }

  /*
  async enterDeceasedDetails(
    firstName: string,
    lastName: string,
    dobDay: string,
    dobMonth: string,
    dobYear: string,
    dodDay: string,
    dodMonth: string,
    dodYear: string,
  ): Promise<void> {
    await this.getInputById('firstName').fill(firstName);
    await this.getInputById('lastName').fill(lastName);
    await this.clickSaveAndContinue(ROUTES.intestacyDeceasedDob);

    await this.fillDateByIdPrefix('dob-date', dobDay, dobMonth, dobYear);
    await this.clickSaveAndContinue(ROUTES.intestacyDeceasedDod);

    await this.fillDateByIdPrefix('dod-date', dodDay, dodMonth, dodYear);
    await this.clickSaveAndContinue(ROUTES.intestacyDeceasedAddress);
  }

  async enterDeceasedAddress(
    line1: string,
    line2: string,
    line3: string,
    town: string,
    postcode: string,
    country: string,
  ): Promise<void> {
    await this.getInputById('addressLine1').fill(line1);
    await this.getInputById('addressLine2').fill(line2);
    await this.getInputById('addressLine3').fill(line3);
    await this.getInputById('postTown').fill(town);
    await this.getInputById('postCode').fill(postcode);
    await this.getInputById('country').fill(country);

    await this.clickSaveAndContinue(ROUTES.intestacyDiedEngOrWales);
  }

  async selectDiedEngOrWales(option: string): Promise<void> {
    await this.selectRadioByIdAndContinue(option, ROUTES.intestacyCertificateInterim);
  }

  async selectEnglishForeignDeathCert(answer: string = ''): Promise<void> {
  await expect(this.page.locator(`#deathCertificateInterim${answer}`)).toBeEnabled();
  await this.page.locator(`#deathCertificateInterim${answer}`).click();
  await this.clickSaveAndContinue();
}

async selectForeignDeathCertTranslation(answer: string = ''): Promise<void> {
  await expect(this.page.locator(`#deathCertificateTranslation${answer}`)).toBeEnabled();
  await this.page.locator(`#deathCertificateTranslation${answer}`).click();
  await this.clickSaveAndContinue();
}

async selectEEComplete(answer: string = ''): Promise<void> {
  await expect(this.page.locator(`#eeComplete${answer}`)).toBeEnabled();
  await this.page.locator(`#eeComplete${answer}`).click();
  await this.clickSaveAndContinue();
}

async selectSubmittedToHmrc(answer: string = ''): Promise<void> {
  await expect(this.page.locator(`#submittedToHmrc${answer}`)).toBeEnabled();
  await this.page.locator(`#submittedToHmrc${answer}`).click();
  await this.clickSaveAndContinue();
}

async selectHmrcLetterComplete(answer: string = ''): Promise<void> {
  await expect(this.page.locator(`#hmrcLetter${answer}`)).toBeEnabled();
  await this.page.locator(`#hmrcLetter${answer}`).click();
  await this.clickSaveAndContinue();
}

async enterHmrcCode(hmrcCode: string): Promise<void> {
  const input = this.page.locator('#hmrcCode');
  await input.fill(hmrcCode);
  await this.clickSaveAndContinue();
}

async enterProbateAssetValues(grossValue: string, netValue: string): Promise<void> {
  await this.page.locator('#grossValue').fill(grossValue);
  await this.page.locator('#netValue').fill(netValue);
  await this.clickSaveAndContinue();
}

async selectAssetsOutsideEnglandWales(answer: string = ''): Promise<void> {
  await this.page.locator(`#assetsOutsideEnglandWales${answer}`).click();
  await this.clickSaveAndContinue();
}

async enterValueAssetsOutsideEnglandWales(value: string): Promise<void> {
  await this.page.locator('#assetsOutsideEnglandWalesValue').fill(value);
  await this.clickSaveAndContinue();
}

async selectDeceasedAlias(answer: string = ''): Promise<void> {
  await this.page.locator(`#deceasedAlias${answer}`).click();
  await this.clickSaveAndContinue();
}

async selectDeceasedMaritalStatus(answer: string = ''): Promise<void> {
  await this.page.locator(`#maritalStatus${answer}`).click();
  await this.clickSaveAndContinue();
}
  */

}
