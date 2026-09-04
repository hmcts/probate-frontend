import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class DeceasedWholeSiblingsPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyDeceasedWholeSiblings;
  private readonly nextPageUrl = ROUTES.intestacyWholeSiblingsSurvivingChildren;

  async selectYesSomeOfThem(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'anyPredeceasedWholeSiblings',
      this.nextPageUrl,
      'Save and continue',
    );
  }

  async selectYesAllOfThem(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'anyPredeceasedWholeSiblings-2',
      this.nextPageUrl,
      'Save and continue',
    );
  }

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'anyPredeceasedWholeSiblings-3',
      this.nextPageUrl,
      'Save and continue',
    );
  }
}
