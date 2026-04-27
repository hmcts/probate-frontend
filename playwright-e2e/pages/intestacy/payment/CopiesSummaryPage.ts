import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';

export class CopiesSummaryPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/copies-summary$/;
  private readonly nextPageUrl = /\/payment-breakdown$/;

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
