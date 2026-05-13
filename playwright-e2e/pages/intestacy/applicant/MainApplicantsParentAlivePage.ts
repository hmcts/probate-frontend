import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class MainApplicantsParentAlivePage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyMainApplicantsParentAlive;
  private readonly nextPageUrl = ROUTES.intestacyMainApplicantsParentAdoptedIn;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'childAlive',
      this.nextPageUrl,
      'Save and continue',
    );
  }

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'childAlive-2',
      this.nextPageUrl,
      'Save and continue',
    );
  }
}
