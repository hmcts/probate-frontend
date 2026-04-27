import { BasePage } from '../../base/BasePage';

export class BilingualGopPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/bilingual-gop$/;
  private readonly nextPageUrl = /\/intestacy\/deceased-name$/;

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('bilingual-2', this.nextPageUrl);
  }

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('bilingual', this.nextPageUrl);
  }
}
