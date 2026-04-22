import { BasePage } from '../../base/BasePage';

export class DiedEngOrWalesPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/died-eng-or-wales$/;
  private readonly nextPageUrl = /\/intestacy\/certificate-interim$/;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('diedEngOrWales', this.nextPageUrl, 'Save and continue');
  }

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('diedEngOrWales-2', this.nextPageUrl, 'Save and continue');
  }
}
