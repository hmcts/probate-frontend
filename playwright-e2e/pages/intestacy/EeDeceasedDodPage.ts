import { expect, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class EeDeceasedDodPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async selectYes(): Promise<void> {
    await this.page.waitForURL(/\/ee-deceased-dod$/);

    const yesRadio = this.getRadioById('eeDeceasedDod');
    await expect(yesRadio).toBeVisible();
    await yesRadio.check();

    await expect(this.getContinueButton()).toBeVisible();

    await Promise.all([
      this.page.waitForURL(/\/ee-estate-valued$/),
      this.clickContinue(),
    ]);
  }

  async selectNo(): Promise<void> {
    await this.page.waitForURL(/\/ee-deceased-dod$/);

    const noRadio = this.getRadioById('eeDeceasedDod-2');
    await expect(noRadio).toBeVisible();
    await noRadio.check();

    await expect(this.getContinueButton()).toBeVisible();

    await Promise.all([
      this.page.waitForURL(/\/ee-estate-valued$/),
      this.clickContinue(),
    ]);
  }
}
