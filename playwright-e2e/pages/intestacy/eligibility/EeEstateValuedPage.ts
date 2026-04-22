import { BasePage } from '../../base/BasePage';

export class EeEstateValuedPage extends BasePage {
  private readonly pageUrl = /\/ee-estate-valued/;
  private readonly nextPageUrl = /\/will-left/;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('eeEstateValued', this.nextPageUrl, 'Continue');
  }
}
