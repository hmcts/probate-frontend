import { expect, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class DeceasedDodPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/deceased-dod$/;
  private readonly nextPageUrl = /\/intestacy\/deceased-address$/;

  constructor(page: Page) {
    super(page);
  }

  async fillDateOfDeath(day: string, month: string, year: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    const dayInput = this.getInputById('dod-date-day');
    const monthInput = this.getInputById('dod-date-month');
    const yearInput = this.getInputById('dod-date-year');

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

  async fillDateOfDeathAndContinue(day: string, month: string, year: string): Promise<void> {
    await this.fillDateOfDeath(day, month, year);
    await this.saveAndContinue();
  }
}
