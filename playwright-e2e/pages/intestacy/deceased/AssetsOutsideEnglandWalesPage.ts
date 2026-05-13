import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class AssetsOutsideEnglandWalesPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyAssetsOutsideEnglandWales;
  private readonly nextPageUrl = ROUTES.intestacyDeceasedAlias;

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('assetsOutside-2', this.nextPageUrl, 'Save and continue');
  }
}
