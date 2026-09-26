import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class BilingualGopPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyBilingualGop;
  private readonly nextPageUrl = ROUTES.intestacyDeceasedName;

  private async selectOptionAndContinue(radioId: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(radioId, this.nextPageUrl, 'Save and continue');
  }

  async selectNo(): Promise<void> {
    await this.selectOptionAndContinue('bilingual-2');
  }

  async selectYes(): Promise<void> {
    await this.selectOptionAndContinue('bilingual');
  }
}
