import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class HmrcLetterPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyHmrcLetter;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('hmrcLetterId', undefined, 'Save and continue');
  }
}
