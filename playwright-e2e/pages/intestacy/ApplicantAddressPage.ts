import { expect, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

type ApplicantAddress = {
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  postTown: string;
  postcode: string;
  country: string;
};

export class ApplicantAddressPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/applicant-address$/;

  constructor(page: Page) {
    super(page);
  }

  async enterAddress(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    const enterAddressInsteadSummary = this.page.getByRole('group', { name: /enter an address instead/i }).locator('summary');
    await expect(enterAddressInsteadSummary).toBeVisible();
    await enterAddressInsteadSummary.click();

    const addressLine1Input = this.getInputById('addressLine1');
    const addressLine2Input = this.getInputById('addressLine2');
    const addressLine3Input = this.getInputById('addressLine3');
    const postTownInput = this.getInputById('postTown');
    const newPostCodeInput = this.getInputById('newPostCode');
    const countryInput = this.getInputById('country');

    await expect(addressLine1Input).toBeVisible();
    await expect(addressLine2Input).toBeVisible();
    await expect(addressLine3Input).toBeVisible();
    await expect(postTownInput).toBeVisible();
    await expect(newPostCodeInput).toBeVisible();
    await expect(countryInput).toBeVisible();

    await addressLine1Input.fill('Buckingham Palace');
    await addressLine2Input.fill('');
    await addressLine3Input.fill('');
    await postTownInput.fill('London');
    await newPostCodeInput.fill('SW1A 1AA');
    await countryInput.fill('United Kingdom');
  }

  async saveAndContinue(): Promise<void> {
    const saveAndContinueButton = this.page.locator('#submitAddress');

    await expect(saveAndContinueButton).toBeVisible();

    await Promise.all([
      this.page.waitForURL(this.pageUrl, { waitUntil: 'domcontentloaded' }),
      saveAndContinueButton.click(),
    ]);
  }

  async enterAddressAndContinue(): Promise<void> {
    await this.enterAddress();
    await this.saveAndContinue();
  }
}
