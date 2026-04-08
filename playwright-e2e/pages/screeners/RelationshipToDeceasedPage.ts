import { expect, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class RelationshipToDeceasedPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async selectChild(): Promise<void> {
    const childOption = this.page.getByLabel(/child/i);
    await expect(childOption).toBeVisible();
    await childOption.check();
    await this.clickContinue();
  }
}
