import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class MainApplicantsParentAdoptedInPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyMainApplicantsParentAdoptedIn;
  private readonly nextPageUrl = ROUTES.intestacyParentAdoptionPlace;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'parentAdoptedIn',
      this.nextPageUrl,
      'Save and continue',
    );
  }

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'parentAdoptedIn-2',
      this.nextPageUrl,
      'Save and continue',
    );
  }
}
