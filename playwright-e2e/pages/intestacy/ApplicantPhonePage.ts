import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class ApplicantPhonePage extends BasePage {
  private readonly pageUrl = /\/intestacy\/applicant-phone$/;
  private readonly phoneNumberInput: Locator;
  private readonly saveAndContinueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.phoneNumberInput = page.locator('#phoneNumber');
    this.saveAndContinueButton = page.getByRole('button', { name: 'Save and continue' });
  }

  async fillApplicantPhoneAndContinue(phoneNumber: string): Promise<void> {
    await expect(this.page).toHaveURL(this.pageUrl);
    await this.phoneNumberInput.fill(phoneNumber);
    await this.saveAndContinueButton.click();
  }
}