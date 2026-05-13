import { expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { ROUTES } from '../../constants/routes';

export class SummaryDeclarationPage extends BasePage {
  private readonly pageUrl = ROUTES.summaryDeclaration;
  private readonly nextPageUrl = ROUTES.declaration;

  async continueToDeclaration(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await expect(this.page.getByRole('heading', { name: 'Check your answers' })).toBeVisible();

    const continueButton = this.page.getByRole('button', { name: 'Save and continue' });
    await expect(continueButton).toBeVisible();

    await Promise.all([
      this.page.waitForURL(this.nextPageUrl, { waitUntil: 'domcontentloaded' }),
      continueButton.click(),
    ]);
  }
}
