import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class AnyGrandchildrenUnder18Page extends BasePage {
  private readonly pageUrl = ROUTES.intestacyAnyGrandchildrenUnder18;
  private readonly nextPageUrl = ROUTES.intestacyAllChildrenOver18;

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'anyGrandchildrenUnder18-2',
      this.nextPageUrl,
      'Save and continue',
    );
  }
}
