import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export type AnySurvivingGrandchildren = 'yes' | 'no';

export class AnySurvivingGrandchildrenPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyAnySurvivingGrandchildren;
  private readonly nextPageUrl = ROUTES.intestacyAnyGrandchildrenUnder18;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'anySurvivingGrandchildren',
      this.nextPageUrl,
      'Save and continue',
    );
  }

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'anySurvivingGrandchildren-2',
      this.nextPageUrl,
      'Save and continue',
    );
  }
}
