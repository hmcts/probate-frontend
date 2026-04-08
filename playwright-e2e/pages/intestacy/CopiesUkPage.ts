import { expect, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class CopiesUkPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async enterCopies(count: string): Promise<void> {
    const copiesInput = this.page.getByLabel(/copies|uk copies|number of copies/i);
    await expect(copiesInput).toBeVisible();
    await copiesInput.fill(count);
    await this.clickContinue();
  }
}
