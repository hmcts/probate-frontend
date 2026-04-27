import { BasePage } from '../../base/BasePage';

export class AnySurvivingGrandchildrenPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/any-surviving-grandchildren$/;
  private readonly nextPageUrl = /\/intestacy\/any-grandchildren-under-18$/;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'anySurvivingGrandchildren',
      this.nextPageUrl,
      'Save and continue',
    );
  }
}
