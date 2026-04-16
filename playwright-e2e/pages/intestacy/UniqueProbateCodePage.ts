import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class UniqueProbateCodePage extends BasePage {
  private readonly pageUrl = /\/intestacy\/unique-probate-code$/;
  private readonly uniqueProbateCodeInput: Locator;
  private readonly saveAndContinueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.uniqueProbateCodeInput = page.locator('#uniqueProbateCodeId');
    this.saveAndContinueButton = page.getByRole('button', { name: 'Save and continue' });
  }

  async fillUniqueProbateCodeAndContinue(code: string): Promise<void> {
    await expect(this.page).toHaveURL(this.pageUrl);
    await this.uniqueProbateCodeInput.fill(code);
    await this.saveAndContinueButton.click();
  }
}
