import { BasePage } from '../../base/BasePage';

export class NewSubmittedToHmrcPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/new-submitted-to-hmrc$/;
  private readonly nextPageUrl = /\/intestacy\/hmrc-letter$/;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('estateValueCompleted', this.nextPageUrl, 'Save and continue');
  }
}
