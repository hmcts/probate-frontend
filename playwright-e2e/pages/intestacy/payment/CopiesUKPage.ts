import { BasePage } from '../../base/BasePage';

export class CopiesUkPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/copies-uk$/;
  private readonly nextPageUrl = /\/intestacy\/assets-overseas$/;

  async enterExtraOfficialCopiesAndContinue(copies: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    await this.getInputById('uk').fill(copies);

    await this.clickSaveAndContinue(this.nextPageUrl);
  }
}
