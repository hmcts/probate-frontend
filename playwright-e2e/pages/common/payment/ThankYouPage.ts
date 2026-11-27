import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class ThankYouPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyThankYou;

  async expectApplicationSubmitted(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await expect(this.page.getByRole('heading', { name: 'Application submitted' })).toBeVisible();
  }

  async getCaseId(): Promise<string> {
    await this.waitForPageUrl(this.pageUrl);

    const caseId = this.page.locator('strong[aria-label]').first();
    await expect(caseId).toBeVisible();
    await expect(caseId).not.toHaveText('');

    return (await caseId.textContent())?.trim() ?? '';
  }
}
