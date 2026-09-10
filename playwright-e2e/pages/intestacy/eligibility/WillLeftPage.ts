import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class WillLeftPage extends BasePage {
  private readonly pageUrl = ROUTES.willLeft;
  private readonly nextPageUrl = ROUTES.relatedToDeceased;

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('left-2', this.nextPageUrl, 'Continue');
  }
}
