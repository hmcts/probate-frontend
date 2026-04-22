import { BasePage } from '../../base/BasePage';

export class ProbateEstateValuesPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/probate-estate-values$/;

  async enterEstateValuesAndContinue(grossValue: string, netValue: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.getInputById('grossValueField').fill(grossValue);
    await this.getInputById('netValueField').fill(netValue);
    await this.clickSaveAndContinue();
  }
}
