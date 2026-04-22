import { BasePage } from '../../base/BasePage';

export class DeceasedAliasPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/deceased-alias$/;
  private readonly nextPageUrl = /\/intestacy\/deceased-marital-status$/;

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('alias-2', this.nextPageUrl, 'Save and continue');
  }
}
