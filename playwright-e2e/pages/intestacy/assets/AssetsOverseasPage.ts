import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class AssetsOverseasPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyAssetsOverseas;
  private readonly nextPageUrl = ROUTES.intestacyCopiesOverseas;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'assetsoverseas',
      this.nextPageUrl,
    );
  }
}
