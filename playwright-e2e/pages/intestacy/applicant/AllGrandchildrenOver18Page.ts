import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class AllGrandchildrenOver18Page extends BasePage {
  private readonly pageUrl = ROUTES.intestacyAllGrandchildrenOver18;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'grandchildParentHasAllChildrenOver18',
      undefined,
      'Save and continue',
    );
  }

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'grandchildParentHasAllChildrenOver18-2',
      undefined,
      'Save and continue',
    );
  }
}
