import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';

export class EqualityAndDiversityPage extends BasePage {
  private readonly pageUrl = /https:\/\/pcq\.ithc\.platform\.hmcts\.net\/start-page/;

  async optOut(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    const button = this.getButtonByText("I don't want to answer these questions");
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
    await button.click();
  }
}
