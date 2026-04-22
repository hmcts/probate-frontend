import { Page } from '@playwright/test';
import { BasePage } from '../../base/BasePage';

export class DeathCertificatePage extends BasePage {
  private readonly pageUrl = /\/death-certificate$/;
  private readonly nextPageUrl = /\/death-certificate-english$/;

  constructor(page: Page) {
    super(page);
  }

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('deathCertificate', this.nextPageUrl, 'Continue');
  }

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('deathCertificate-2', this.nextPageUrl, 'Continue');
  }
}
