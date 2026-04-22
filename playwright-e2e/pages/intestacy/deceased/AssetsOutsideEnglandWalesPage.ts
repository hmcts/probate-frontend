import { BasePage } from '../../base/BasePage';

export class AssetsOutsideEnglandWalesPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/assets-outside-england-wales$/;
  private readonly nextPageUrl = /\/intestacy\/deceased-alias$/;

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('assetsOutside-2', this.nextPageUrl, 'Save and continue');
  }
}
