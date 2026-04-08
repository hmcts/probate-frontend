import { expect, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class AssetsOverseasPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async selectNo(): Promise<void> {
    const noOption = this.page.getByLabel(/^no$/i);
    await expect(noOption).toBeVisible();
    await noOption.check();
    await this.clickContinue();
  }
}
