import { BasePage } from '../../base/BasePage';

export class HmrcLetterPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/hmrc-letter$/;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('hmrcLetterId', undefined, 'Save and continue');
  }
}
