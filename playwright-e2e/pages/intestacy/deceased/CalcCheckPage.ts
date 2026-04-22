import { BasePage } from '../../base/BasePage';

export class CalcCheckPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/calc-check$/;
  private readonly nextPageUrl = /\/intestacy\/new-submitted-to-hmrc$/;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('calcCheckCompleted', this.nextPageUrl, 'Save and continue');
  }
}
