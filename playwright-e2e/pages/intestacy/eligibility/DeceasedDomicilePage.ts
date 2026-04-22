import { BasePage } from '../../base/BasePage';

export class DeceasedDomicilePage extends BasePage {
  private readonly pageUrl = /\/deceased-domicile/;
  private readonly nextPageUrl = /\/ee-deceased-dod/;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('domicile', this.nextPageUrl, 'Continue');
  }
}
