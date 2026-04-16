import { expect, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class DeceasedDobPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/deceased-dob$/;
  private readonly nextPageUrl = /\/intestacy\/deceased-dod$/;

  constructor(page: Page) {
    super(page);
  }

  async fillDateOfBirth(day: string, month: string, year: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    const dayInput = this.getInputById('dob-date-day');
    const monthInput = this.getInputById('dob-date-month');
    const yearInput = this.getInputById('dob-date-year');

    await expect(dayInput).toBeVisible();
    await expect(monthInput).toBeVisible();
    await expect(yearInput).toBeVisible();

    await dayInput.fill(day);
    await monthInput.fill(month);
    await yearInput.fill(year);
  }

  async saveAndContinue(): Promise<void> {
    const saveAndContinueButton = this.getSaveAndContinueButton();
    await expect(saveAndContinueButton).toBeVisible();

    await Promise.all([
      this.page.waitForURL(this.nextPageUrl, { waitUntil: 'domcontentloaded' }),
      saveAndContinueButton.click(),
    ]);
  }

  async fillDateOfBirthAndContinue(day: string, month: string, year: string): Promise<void> {
    await this.fillDateOfBirth(day, month, year);
    await this.saveAndContinue();
  }
}
