import { BasePage } from '../../base/BasePage';

export class AdoptedInEnglandOrWalesPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/adopted-in-england-or-wales$/;
  private readonly nextPageUrl = /\/intestacy\/any-other-children$/;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'adoptionPlace',
      this.nextPageUrl,
      'Save and continue',
    );
  }

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'adoptionPlace-2',
      this.nextPageUrl,
      'Save and continue',
    );
  }
}
