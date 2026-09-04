import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class ParentAdoptionPlacePage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyParentAdoptionPlace;
  private readonly nextPageUrl = ROUTES.intestacyMainApplicantAdoptedIn;

  async selectYes(): Promise<void> {
  await this.waitForPageUrl(this.pageUrl);
  await this.selectRadioById('parentAdoptionPlace');
  await this.clickSaveAndContinue();
}

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'parentAdoptionPlace-2',
      this.nextPageUrl,
      'Save and continue',
    );
  }
}
