import { BasePage } from '../../base/BasePage';

export class WillLeftPage extends BasePage {
  private readonly pageUrl = /\/will-left/;
  private readonly nextPageUrl = /\/related-to-deceased/;

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('left-2', this.nextPageUrl, 'Continue');
  }
}
