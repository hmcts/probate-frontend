import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class AllChildrenOver18Page extends BasePage {
  private readonly pageUrl = ROUTES.intestacyAllChildrenOver18;

  async selectYes(
    nextPageUrl: RegExp = ROUTES.intestacyApplicantName
  ): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'allChildrenOver18',
      nextPageUrl,
      'Save and continue'
    );
  }

  async selectNo(
    nextPageUrl: RegExp = ROUTES.intestacyApplicantName
  ): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'allChildrenOver18-2',
      nextPageUrl,
      'Save and continue'
    );
  }
}
