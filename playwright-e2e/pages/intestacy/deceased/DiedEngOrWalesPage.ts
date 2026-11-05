import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class DiedEngOrWalesPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyDiedEngOrWales;
  private readonly nextPageUrl = ROUTES.intestacyCertificateInterim;

  private async selectOptionAndContinue(radioId: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(radioId, this.nextPageUrl, 'Save and continue');
  }

  async selectYes(): Promise<void> {
    await this.selectOptionAndContinue('diedEngOrWales');
  }

  async selectNo(): Promise<void> {
    await this.selectOptionAndContinue('diedEngOrWales-2');
  }
}
