import { expect, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class StartEligibilityPage extends BasePage {
  private readonly pageUrl = /start-eligibility/;
  private readonly nextPageUrl = /death-certificate/;

  constructor(page: Page) {
    super(page);
  }

  async continue(): Promise<void> {
    await this.page.waitForURL(this.pageUrl);

    const startButton = this.getStartButton();
    await expect(startButton).toBeVisible();

    await Promise.all([
      this.page.waitForURL(this.nextPageUrl),
      startButton.click(),
    ]);
  }
}
