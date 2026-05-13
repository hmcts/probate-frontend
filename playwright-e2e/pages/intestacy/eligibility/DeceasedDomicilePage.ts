import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class DeceasedDomicilePage extends BasePage {
  private readonly pageUrl = ROUTES.deceasedDomicile;
  private readonly yesNextPageUrl = ROUTES.eeDeceasedDod;
  private readonly noNextPageUrl = ROUTES.eeEstateValued;

  private async selectOptionAndContinue(radioId: string, nextPageUrl: RegExp): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(radioId, nextPageUrl, 'Continue');
  }

  async selectYes(): Promise<void> {
    await this.selectOptionAndContinue('domicile', this.yesNextPageUrl);
  }

  async selectNo(): Promise<void> {
    await this.selectOptionAndContinue('domicile-2', this.noNextPageUrl);
  }
}
