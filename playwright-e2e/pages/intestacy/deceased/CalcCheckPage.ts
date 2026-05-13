import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class CalcCheckPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyCalcCheck;
  private readonly nextPageUrl = ROUTES.intestacyNewSubmittedToHmrc;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'calcCheckCompleted',
      this.nextPageUrl,
      'Save and continue',
    );
  }

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'calcCheckCompleted-2',
      this.nextPageUrl,
      'Save and continue',
    );
  }
}
