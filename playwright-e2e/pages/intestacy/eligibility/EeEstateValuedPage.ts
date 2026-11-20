import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class EeEstateValuedPage extends BasePage {
  private readonly pageUrl = ROUTES.eeEstateValued;
  private readonly nextPageUrl = ROUTES.willLeft;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('eeEstateValued', this.nextPageUrl, 'Continue');
  }

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('eeEstateValued-2', this.nextPageUrl, 'Continue');
  }
}
