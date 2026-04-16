import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class DeathCertificatePage extends BasePage {
  private readonly pageUrl = /death-certificate/;

  constructor(page: Page) {
    super(page);
  }

  async selectYes(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, 'deathCertificate');
  }

  async selectNo(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, 'deathCertificate-2');
  }
}
