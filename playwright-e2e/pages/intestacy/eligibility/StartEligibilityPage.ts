import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class StartEligibilityPage extends BasePage {
  private readonly pageUrl = ROUTES.startEligibility;
  private readonly nextPageUrl = ROUTES.deathCertificate;

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
