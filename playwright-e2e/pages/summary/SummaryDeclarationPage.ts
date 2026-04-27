import { expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class SummaryDeclarationPage extends BasePage {
  private readonly pageUrl = /\/summary\/declaration$/;
  private readonly nextPageUrl = /\/declaration$/;

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
