import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class AnyLivingDescendantsPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyAnyLivingDescendants;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'anyLivingDescendants',
      undefined,
      'Save and continue',
    );
  }

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'anyLivingDescendants-2',
      undefined,
      'Save and continue',
    );
  }
}
