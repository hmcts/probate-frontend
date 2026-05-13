import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class CopiesSummaryPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyCopiesSummary;
  private readonly nextPageUrl = ROUTES.paymentBreakdown;

  async saveAndContinue(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    const continueLink = this.page.getByRole('button', { name: 'Save and continue' });
    await expect(continueLink).toBeVisible();

    await Promise.all([
      this.page.waitForURL(this.nextPageUrl, { waitUntil: 'domcontentloaded' }),
      continueLink.click(),
    ]);
  }
}
