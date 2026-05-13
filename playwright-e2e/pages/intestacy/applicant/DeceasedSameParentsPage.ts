import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class DeceasedSameParentsPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyDeceasedSameParents;

  async selectBothParentsSame(nextPageUrl: RegExp): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'sameParents',
      nextPageUrl,
      'Save and continue',
    );
  }

  async selectOneParentIsTheSame(nextPageUrl: RegExp): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('sameParents-2', nextPageUrl, 'Save and continue');
  }

  async selectDifferentParentsOrStepParent(nextPageUrl: RegExp): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('sameParents-3', nextPageUrl, 'Save and continue');
  }
}
