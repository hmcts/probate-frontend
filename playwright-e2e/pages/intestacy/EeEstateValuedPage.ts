import { expect, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class EeEstateValuedPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async selectYes(): Promise<void> {
    await this.page.waitForURL(/\/ee-estate-valued$/);

    const yesRadio = this.getRadioById('eeEstateValued');
    await expect(yesRadio).toBeVisible();
    await yesRadio.check();

    await expect(this.getContinueButton()).toBeVisible();

    await Promise.all([
      this.page.waitForURL(/\/will-left$/),
      this.clickContinue(),
    ]);
  }

  async selectNo(): Promise<void> {
    await this.page.waitForURL(/\/ee-estate-valued$/);

    const noRadio = this.getRadioById('eeEstateValued-2');
    await expect(noRadio).toBeVisible();
    await noRadio.check();

    await expect(this.getContinueButton()).toBeVisible();

    await Promise.all([
      this.page.waitForURL(/\/will-left$/),
      this.clickContinue(),
    ]);
  }
}
