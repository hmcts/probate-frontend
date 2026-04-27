import { BasePage } from '../../base/BasePage';

export class CopiesOverseasPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/copies-overseas$/;
  private readonly nextPageUrl = /\/intestacy\/copies-summary$/;

  async enterExtraCertifiedCopiesAndContinue(copies: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    await this.getInputById('overseas').fill(copies);

    await this.clickSaveAndContinue(this.nextPageUrl);
  }
}
