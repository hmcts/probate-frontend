import { expect, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class DeathCertificatePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async selectYes(): Promise<void> {
    await this.page.waitForURL(/\/death-certificate$/);

    const yesRadio = this.getRadioById('deathCertificate');
    await expect(yesRadio).toBeVisible();
    await yesRadio.check();

    await expect(this.getContinueButton()).toBeVisible();
    await this.clickContinue();
  }

  async selectNo(): Promise<void> {
    await this.page.waitForURL(/\/death-certificate$/);

    const noRadio = this.getRadioById('deathCertificate-2');
    await expect(noRadio).toBeVisible();
    await noRadio.check();

    await expect(this.getContinueButton()).toBeVisible();
    await this.clickContinue();
  }
}
