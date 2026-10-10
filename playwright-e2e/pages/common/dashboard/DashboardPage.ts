import { expect, Locator } from '@playwright/test';
import { BasePage } from '../../base/BasePage.ts';

export class DashboardPage extends BasePage {
  private readonly pageUrl = /\/dashboard$/;
  private readonly taskListUrl = /\/task-list$/;
  private readonly continueLinkName = /continue application/i;
  private readonly placeholderName = 'Name not entered yet';

  private getDraftRowByName(name: string): Locator {
    return this.page.locator('tr').filter({ hasText: name }).first();
  }

  private getContinueLinkFromRow(row: Locator): Locator {
    return row.getByRole('link', { name: this.continueLinkName });
  }

  private getAnyContinueApplicationLink(): Locator {
    return this.page.getByRole('link', { name: this.continueLinkName }).first();
  }

  private async navigateViaContinueLink(continueLink: Locator): Promise<void> {
    await expect(continueLink).toBeVisible();

    await Promise.all([
      this.page.waitForURL(this.taskListUrl, { waitUntil: 'domcontentloaded' }),
      continueLink.click(),
    ]);
  }

  async waitForPage(): Promise<void> {
    await expect(this.page).toHaveURL(this.pageUrl);
  }

  async continueDraftApplicationByName(name: string): Promise<void> {
    await this.waitForPage();

    const row = this.getDraftRowByName(name);
    await expect(row).toBeVisible();

    await this.navigateViaContinueLink(this.getContinueLinkFromRow(row));
  }

  async continueDraftApplicationWithoutName(): Promise<void> {
    await this.waitForPage();

    const row = this.getDraftRowByName(this.placeholderName);
    await expect(row).toBeVisible();

    await this.navigateViaContinueLink(this.getContinueLinkFromRow(row));
  }

  async continueDraftApplication(): Promise<void> {
    await this.waitForPage();
    await this.navigateViaContinueLink(this.getAnyContinueApplicationLink());
  }
}
