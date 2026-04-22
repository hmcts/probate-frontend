import { expect, Page } from '@playwright/test';
import { BasePage } from '../../base/BasePage';

export class StartEligibilityPage extends BasePage {
  private readonly pageUrl = /\/start-eligibility$/;
  private readonly nextPageUrl = /\/death-certificate$/;

  constructor(page: Page) {
    super(page);
  }

  async continue(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    const continueLink = this.page.locator('a[href="/death-certificate"]');
    await expect(continueLink).toBeVisible();

    await Promise.all([
      this.page.waitForURL(this.nextPageUrl, { waitUntil: 'domcontentloaded' }),
      continueLink.click(),
    ]);
  }
}
