import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class PaymentBreakdownPage extends BasePage {
  private readonly pageUrl = ROUTES.paymentBreakdown;

  async payAndSubmitApplication(nextPageUrl?: RegExp): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    const button = this.getButtonByText('Pay and submit application');
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();

    if (nextPageUrl) {
      await Promise.all([
        this.page.waitForURL(nextPageUrl, { waitUntil: 'domcontentloaded' }),
        button.click(),
      ]);
    } else {
      await button.click();
    }
  }
}
