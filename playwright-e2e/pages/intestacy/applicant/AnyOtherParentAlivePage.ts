import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class AnyOtherParentAlivePage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyAnyOtherParentAlive;
  private readonly nextPageUrl = ROUTES.intestacyApplicantName;

    async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'anyOtherParentAlive',
      this.nextPageUrl,
      'Save and continue',
    );
  }

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'anyOtherParentAlive-2',
      this.nextPageUrl,
      'Save and continue',
    );
  }
}