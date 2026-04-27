import { BasePage } from '../../base/BasePage';

export class AnyOtherChildrenPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/any-other-children$/;
  private readonly nextPageUrl = /\/intestacy\/any-predeceased-children$/;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'anyOtherChildren',
      this.nextPageUrl,
      'Save and continue',
    );
  }
}
