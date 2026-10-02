import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class MainApplicantsParentAnyOtherChildrenPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyMainApplicantsParentAnyOtherChildren;
  private readonly nextPageUrl = ROUTES.intestacyAllGrandchildrenOver18;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'grandchildParentHasOtherChildren',
      this.nextPageUrl,
      'Save and continue',
    );
  }

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'grandchildParentHasOtherChildren-2',
      this.nextPageUrl,
      'Save and continue',
    );
  }
}
