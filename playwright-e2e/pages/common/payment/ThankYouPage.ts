import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';

export class ThankYouPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/thank-you$/;

  async expectApplicationSubmitted(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await expect(this.page.getByRole('heading', { name: 'Application submitted' })).toBeVisible();
  }

  async getCaseId(): Promise<string> {
    await this.waitForPageUrl(this.pageUrl);
    const caseId = this.page.locator('strong[aria-label]').first();
    await expect(caseId).toBeVisible();
    return (await caseId.textContent())?.trim() ?? '';
  }

  async printCaseId(): Promise<void> {
  const caseId = await this.getCaseId();
  console.log(`Case ID: ${caseId}`);
}
}
