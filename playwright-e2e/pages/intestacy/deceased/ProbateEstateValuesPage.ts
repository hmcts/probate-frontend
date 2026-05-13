import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class ProbateEstateValuesPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyProbateEstateValues;
  private readonly nextPageUrl = ROUTES.intestacyAssetsOutsideEnglandWales;

  async enterEstateValuesAndContinue(grossValue: string, netValue: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.getInputById('grossValueField').fill(grossValue);
    await this.getInputById('netValueField').fill(netValue);
    await this.clickSaveAndContinue(this.nextPageUrl);
  }
}
