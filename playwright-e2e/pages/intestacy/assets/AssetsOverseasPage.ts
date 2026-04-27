import { BasePage } from '../../base/BasePage';

export class AssetsOverseasPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/assets-overseas$/;
  private readonly nextPageUrl = /\/intestacy\/copies-overseas$/;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'assetsoverseas',
      this.nextPageUrl,
    );
  }
}
