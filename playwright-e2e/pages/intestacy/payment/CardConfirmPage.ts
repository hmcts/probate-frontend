import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';

export class CardConfirmPage extends BasePage {
  private readonly pageUrl = /\/confirm$/;
  private readonly nextPageUrl = /\/intestacy\/thank-you$/;

  async confirmPayment(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    const button = this.page.getByRole('button', { name: 'Confirm payment' });
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();

    await Promise.all([
      this.page.waitForURL(this.nextPageUrl, { waitUntil: 'domcontentloaded' }),
      button.click(),
    ]);
  }
}
