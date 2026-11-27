import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class DeceasedAliasPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyDeceasedAlias;
  private readonly nextPageUrl = ROUTES.intestacyDeceasedMaritalStatus;

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('alias-2', this.nextPageUrl, 'Save and continue');
  }
}
