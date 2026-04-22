import { expect, Page } from '@playwright/test';
import { BasePage } from '../../base/BasePage';

export class StartApplyPage extends BasePage {
  private readonly pageUrl = /\/start-apply$/;
  private readonly loginPageUrl = /idam-web-public\.ithc\.platform\.hmcts\.net\/login/;

  constructor(page: Page) {
    super(page);
  }

  async clickLogIn(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    const loginLink = this.page.getByRole('link', { name: /log in\.?/i });
    await expect(loginLink).toBeVisible();

    await Promise.all([
      this.page.waitForURL(this.loginPageUrl, { waitUntil: 'domcontentloaded' }),
      loginLink.click(),
    ]);
  }
}
