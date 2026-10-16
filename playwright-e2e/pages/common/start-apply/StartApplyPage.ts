import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class StartApplyPage extends BasePage {
  private readonly pageUrl = ROUTES.startApply;
  private readonly nextPageUrl = ROUTES.dashboard;

  async clickLogIn(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    const loginLink = this.page.getByRole('link', { name: 'Log in' });
    await expect(loginLink).toBeVisible();

    await Promise.all([
      this.page.waitForURL(this.nextPageUrl, { waitUntil: 'domcontentloaded' }),
      loginLink.click(),
    ]);
  }
}
