import { BasePage } from '../../base/BasePage';

export class BilingualGopPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/bilingual-gop$/;
  private readonly nextPageUrl = /\/intestacy\/deceased-name$/;

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioById('bilingual-2');
    await this.clickSaveAndContinue(this.nextPageUrl);
  }

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioById('bilingual');
    await this.clickSaveAndContinue(this.nextPageUrl);
  }
}
