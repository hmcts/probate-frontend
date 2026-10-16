import { expect } from '@playwright/test';
import { BasePage } from '../base/BasePage.ts';
import { ROUTES } from '../../constants/routes.ts';

export class DeclarationPage extends BasePage {
  private readonly pageUrl = ROUTES.declaration;

  async confirmDeclarationAndContinue(nextPageUrl: RegExp): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    await expect(
      this.page.getByRole('heading', {
        name: 'Check the legal statement and make your declaration',
      }),
    ).toBeVisible();

    const checkbox = this.page.locator('#declarationCheckbox');
    await expect(checkbox).toBeVisible();

    await checkbox.check();
    await expect(checkbox).toBeChecked();

    const continueButton = this.page.getByRole('button', { name: 'Save and continue' });
    await expect(continueButton).toBeVisible();
    await expect(continueButton).toBeEnabled();

    await Promise.all([
      this.page.waitForURL(nextPageUrl, { waitUntil: 'domcontentloaded' }),
      continueButton.click(),
    ]);
  }
}
