import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class DeceasedAdoptionPlacePage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyDeceasedAdoptionPlace;

  async selectYes(
    nextPageUrl: RegExp = ROUTES.intestacyApplicantName
  ): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'deceasedAdoptionPlace',
      nextPageUrl,
      'Save and continue'
    );
  }

  async selectNo(
    nextPageUrl: RegExp = ROUTES.intestacyApplicantName
  ): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'deceasedAdoptionPlace-2',
      nextPageUrl,
      'Save and continue'
    );
  }
}
