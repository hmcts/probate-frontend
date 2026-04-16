import { expect, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class DashboardPage extends BasePage {
  private readonly pageUrl = /\/dashboard$/;
  private readonly nextPageUrl = /\/start-eligibility$/;

  constructor(page: Page) {
    super(page);
  }

  getStartNewApplicationLink() {
    return this.getLinkByHref('/start-eligibility');
  }

  async clickStartNewApplication(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    const startNewApplicationLink = this.getStartNewApplicationLink();
    await expect(startNewApplicationLink).toBeVisible();

    await Promise.all([
      this.page.waitForURL(this.nextPageUrl),
      startNewApplicationLink.click(),
    ]);
  }
}
