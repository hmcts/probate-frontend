import { expect, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class RelatedToDeceasedPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async selectYes(): Promise<void> {
    const yesOption = this.page.getByLabel(/^yes$/i);
    await expect(yesOption).toBeVisible();
    await yesOption.check();
    await this.clickContinue();
  }
}
