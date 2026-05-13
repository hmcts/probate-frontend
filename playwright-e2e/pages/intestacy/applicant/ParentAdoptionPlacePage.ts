import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

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
