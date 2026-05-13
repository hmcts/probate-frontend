import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class NewSubmittedToHmrcPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyNewSubmittedToHmrc;
  private readonly nextPageUrl = ROUTES.intestacyHmrcLetter;

  private async selectOptionAndContinue(radioId: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(radioId, this.nextPageUrl, 'Save and continue');
  }

  async selectYes(): Promise<void> {
    await this.selectOptionAndContinue('estateValueCompleted');
  }

  async selectNo(): Promise<void> {
    await this.selectOptionAndContinue('estateValueCompleted-2');
  }
}
