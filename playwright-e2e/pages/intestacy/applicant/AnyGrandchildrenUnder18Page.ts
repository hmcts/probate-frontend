import { BasePage } from '../../base/BasePage';

export class AnyGrandchildrenUnder18Page extends BasePage {
  private readonly pageUrl = /\/intestacy\/any-grandchildren-under-18$/;
  private readonly nextPageUrl = /\/intestacy\/all-children-over-18$/;

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'anyGrandchildrenUnder18-2',
      this.nextPageUrl,
      'Save and continue',
    );
  }
}
