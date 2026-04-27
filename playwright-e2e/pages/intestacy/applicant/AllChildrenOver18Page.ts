import { BasePage } from '../../base/BasePage';

export class AllChildrenOver18Page extends BasePage {
  private readonly pageUrl = /\/intestacy\/all-children-over-18$/;
  private readonly nextPageUrl = /\/intestacy\/applicant-name$/;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'allChildrenOver18',
      this.nextPageUrl,
      'Save and continue',
    );
  }
}
