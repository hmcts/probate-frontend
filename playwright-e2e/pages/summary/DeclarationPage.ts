import { expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class DeclarationPage extends BasePage {
  private readonly pageUrl = /\/declaration$/;

  async confirmDeclarationAndContinue(nextPageUrl?: RegExp): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    const checkbox = this.getInputById('declarationCheckbox');
    await expect(checkbox).toHaveCount(1);
    await checkbox.check();

    await this.clickSaveAndContinue(nextPageUrl);
  }
}
