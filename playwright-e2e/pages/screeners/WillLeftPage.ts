import { expect, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class WillLeftPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async selectYes(): Promise<void> {
    await this.page.waitForURL(/\/will-left$/);

    const yesRadio = this.getRadioById('left');
    await expect(yesRadio).toBeVisible();
    await yesRadio.check();

    await this.clickContinue();
  }

  async selectNo(): Promise<void> {
    await this.page.waitForURL(/\/will-left$/);

    const noRadio = this.getRadioById('left-2');
    await expect(noRadio).toBeVisible();
    await noRadio.check();

    await this.clickContinue();
  }
}
