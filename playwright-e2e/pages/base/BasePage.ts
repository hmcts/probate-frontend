import { expect, Locator, Page } from '@playwright/test';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async waitForPageUrl(pageUrl: RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pageUrl);
  }

  getById(id: string): Locator {
    return this.page.locator(`#${id}`);
  }

  getInputById(id: string): Locator {
    return this.page.locator(`input#${id}`);
  }

  getButtonByText(name: string): Locator {
    return this.page.getByRole('button', { name, exact: true });
  }

  async clickContinue(nextPageUrl?: RegExp): Promise<void> {
    const button = this.getButtonByText('Continue');
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();

    if (nextPageUrl) {
      await Promise.all([
        this.page.waitForURL(nextPageUrl, { waitUntil: 'domcontentloaded' }),
        button.click(),
      ]);
      return;
    }

    await button.click();
  }

  async clickSaveAndContinue(nextPageUrl?: RegExp): Promise<void> {
    const button = this.getButtonByText('Save and continue');
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();

    if (nextPageUrl) {
      await Promise.all([
        this.page.waitForURL(nextPageUrl, { waitUntil: 'domcontentloaded' }),
        button.click(),
      ]);
      return;
    }

    await button.click();
  }

  async selectRadioById(radioId: string): Promise<void> {
    const radio = this.getInputById(radioId);
    await expect(radio).toHaveCount(1);
    await radio.setChecked(true);
  }

  async selectRadioByIdAndContinue(
    radioId: string,
    nextPageUrl?: RegExp,
    continueButtonText: 'Continue' | 'Save and continue' = 'Save and continue',
  ): Promise<void> {
    await this.selectRadioById(radioId);

    if (continueButtonText === 'Continue') {
      await this.clickContinue(nextPageUrl);
      return;
    }

    await this.clickSaveAndContinue(nextPageUrl);
  }

  async fillDateByIdPrefix(prefix: string, day: string, month: string, year: string): Promise<void> {
    await this.getInputById(`${prefix}-day`).fill(day);
    await this.getInputById(`${prefix}-month`).fill(month);
    await this.getInputById(`${prefix}-year`).fill(year);
  }
}
