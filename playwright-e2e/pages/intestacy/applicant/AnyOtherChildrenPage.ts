import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class AnyOtherChildrenPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyAnyOtherChildren;
  private readonly nextPageUrl = ROUTES.intestacyAnyPredeceasedChildren;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'anyOtherChildren',
      this.nextPageUrl,
      'Save and continue',
    );
  }

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'anyOtherChildren-2',
      this.nextPageUrl,
      'Save and continue',
    );
  }
}
