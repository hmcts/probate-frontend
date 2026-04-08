import { expect, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class DeceasedDomicilePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async selectYes(): Promise<void> {
    await this.page.waitForURL(/\/deceased-domicile$/);

    const yesRadio = this.getRadioByNameAndValue('domicile', 'optionYes');
    await expect(yesRadio).toBeVisible();
    await yesRadio.check();

    await this.clickContinue();
  }

  async selectNo(): Promise<void> {
    await this.page.waitForURL(/\/deceased-domicile$/);

    const noRadio = this.getRadioByNameAndValue('domicile', 'optionNo');
    await expect(noRadio).toBeVisible();
    await noRadio.check();

    await this.clickContinue();
  }
}
