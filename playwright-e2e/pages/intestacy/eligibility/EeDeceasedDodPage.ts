import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class EeDeceasedDodPage extends BasePage {
  private readonly pageUrl = ROUTES.eeDeceasedDod;
  private readonly nextPageUrl = ROUTES.eeEstateValued;

  private async selectOptionAndContinue(radioId: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(radioId, this.nextPageUrl, 'Continue');
  }

  async selectYes(): Promise<void> {
    await this.selectOptionAndContinue('eeDeceasedDod');
  }

  async selectNo(): Promise<void> {
    await this.selectOptionAndContinue('eeDeceasedDod-2');
  }
}
