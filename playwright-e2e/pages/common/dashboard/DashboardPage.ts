import { expect, Locator } from '@playwright/test';
import { BasePage } from '../../base/BasePage';

export class DashboardPage extends BasePage {
  private readonly pageUrl = /\/dashboard$/;
  private readonly taskListUrl = /\/task-list$/;
  private readonly continueLink = /continue application/i;

  private getDraftRowByName(name: string): Locator {
    return this.page.locator('tr').filter({ hasText: name });
  }

  private getDraftRowByPlaceholderName(): Locator {
    return this.page.locator('tr').filter({ hasText: 'Name not entered yet' });
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
    await this.navigateViaContinueLink(
      this.getDraftRowByName(name).getByRole('link', { name: this.continueLink })
    );
  }

  async continueDraftApplicationWithoutName(): Promise<void> {
    await this.waitForPage();
    await this.navigateViaContinueLink(
      this.getDraftRowByName('Name not entered yet').first().getByRole('link', { name: this.continueLink })
    );
  }

  async continueDraftApplication(): Promise<void> {
    await this.waitForPage();
    await this.navigateViaContinueLink(
      this.page.getByRole('link', { name: this.continueLink }).first()
    );
  }
}
