import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class CardConfirmPage extends BasePage {
  private readonly pageUrl = ROUTES.cardConfirm;
  private readonly nextPageUrl = ROUTES.intestacyThankYou;

  async confirmPayment(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await expect(this.page.getByRole('heading', { name: 'Confirm your payment' })).toBeVisible();

    const button = this.page.getByRole('button', { name: 'Confirm payment' });
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();

    await Promise.all([
      this.page.waitForURL(this.nextPageUrl, { waitUntil: 'domcontentloaded' }),
      button.click(),
    ]);
  }
}
