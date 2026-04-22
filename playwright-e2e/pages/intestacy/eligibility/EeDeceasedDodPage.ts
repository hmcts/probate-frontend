import { BasePage } from '../../base/BasePage';

export class EeDeceasedDodPage extends BasePage {
  private readonly pageUrl = /\/ee-deceased-dod/;
  private readonly nextPageUrl = /\/ee-estate-valued/;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('eeDeceasedDod', this.nextPageUrl, 'Continue');
  }

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('eeDeceasedDod-2', this.nextPageUrl, 'Continue');
  }
}
