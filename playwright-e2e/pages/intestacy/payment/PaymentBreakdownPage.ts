import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';

export class PaymentBreakdownPage extends BasePage {
  private readonly pageUrl = /\/payment-breakdown$/;

  async payAndSubmitApplication(nextPageUrl?: RegExp): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    const button = this.getButtonByText('Pay and submit application');
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();

    await button.click();
    if (nextPageUrl) {
      await this.page.waitForURL(nextPageUrl);
    }
  }
}
