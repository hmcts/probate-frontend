import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class AnyLivingParentsPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyAnyLivingParents;
  private readonly nextPageUrl = ROUTES.intestacyDeceasedAdoptedIn;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'anyLivingParents',
      this.nextPageUrl,
      'Save and continue',
    );
  }

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'anyLivingParents-2',
      this.nextPageUrl,
      'Save and continue',
    );
  }
}
