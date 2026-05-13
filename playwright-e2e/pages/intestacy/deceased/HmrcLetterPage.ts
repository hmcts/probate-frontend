import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class HmrcLetterPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyHmrcLetter;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('hmrcLetterId', undefined, 'Save and continue');
  }
}
