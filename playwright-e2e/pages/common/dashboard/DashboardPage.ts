import { expect, Locator } from '@playwright/test';
import { BasePage } from '../../base/BasePage';

export class DashboardPage extends BasePage {
  private readonly pageUrl = /\/dashboard$/;
  private readonly taskListUrl = /\/task-list$/;

  private getDraftRowByName(name: string): Locator {
    return this.page.locator('tr').filter({ hasText: name });
  }

  private getDraftRowByPlaceholderName(): Locator {
    return this.page.locator('tr').filter({ hasText: 'Name not entered yet' });
  }

  async waitForPage(): Promise<void> {
    await expect(this.page).toHaveURL(this.pageUrl);
  }

  async continueDraftApplicationByName(name: string): Promise<void> {
    await this.waitForPage();

    const row = this.getDraftRowByName(name);
    await expect(row).toHaveCount(1);

    const continueLink = row.getByRole('link', { name: /continue application/i });
    await expect(continueLink).toBeVisible();

    await Promise.all([
      this.page.waitForURL(this.taskListUrl, { waitUntil: 'domcontentloaded' }),
      continueLink.click(),
    ]);
  }

  async continueDraftApplicationWithoutName(): Promise<void> {
    await this.waitForPage();

    const row = this.getDraftRowByPlaceholderName().first();
    await expect(row).toBeVisible();

    const continueLink = row.getByRole('link', { name: /continue application/i });
    await expect(continueLink).toBeVisible();

    await Promise.all([
      this.page.waitForURL(this.taskListUrl, { waitUntil: 'domcontentloaded' }),
      continueLink.click(),
    ]);
  }

  async continueDraftApplication(): Promise<void> {
    await this.waitForPage();

    const continueLink = this.page.getByRole('link', { name: /continue application/i }).first();
    await expect(continueLink).toBeVisible();

    await Promise.all([
      this.page.waitForURL(this.taskListUrl, { waitUntil: 'domcontentloaded' }),
      continueLink.click(),
    ]);
  }
}
