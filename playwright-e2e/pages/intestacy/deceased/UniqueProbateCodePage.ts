import { BasePage } from '../../base/BasePage';

export class UniqueProbateCodePage extends BasePage {
  private readonly pageUrl = /\/intestacy\/unique-probate-code$/;

  async enterUniqueProbateCodeAndContinue(code: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.getInputById('uniqueProbateCodeId').fill(code);
    await this.clickSaveAndContinue();
  }
}
