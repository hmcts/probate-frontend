import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class DeathCertificateEnglishPage extends BasePage {
  private readonly pageUrl = /death-certificate-english/;

  constructor(page: Page) {
    super(page);
  }

  async selectYes(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, 'deathCertificateInEnglish');
  }

  async selectNo(): Promise<void> {
    await this.selectRadioByIdAndContinue(this.pageUrl, 'deathCertificateInEnglish-2');
  }
}
