import { expect, Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class DeathCertificateEnglishPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async selectYes(): Promise<void> {
    await this.page.waitForURL(/\/death-certificate-english$/);

    const yesRadio = this.getRadioById('deathCertificateInEnglish');
    await expect(yesRadio).toBeVisible();
    await yesRadio.check();

    await expect(this.getContinueButton()).toBeVisible();
    await this.clickContinue();
  }

  async selectNo(): Promise<void> {
    await this.page.waitForURL(/\/death-certificate-english$/);

    const noRadio = this.getRadioById('deathCertificateInEnglish-2');
    await expect(noRadio).toBeVisible();
    await noRadio.check();

    await expect(this.getContinueButton()).toBeVisible();
    await this.clickContinue();
  }
}
