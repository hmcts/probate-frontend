import { expect, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class StartEligibilityPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async continue(): Promise<void> {
    await this.page.waitForURL(/\/start-eligibility$/);

    const continueButton = this.page.getByRole('button', { name: /continue/i });

    await expect(continueButton).toBeVisible();

    await Promise.all([
      this.page.waitForURL(/\/death-certificate$/),
      continueButton.click(),
    ]);
  }
}
