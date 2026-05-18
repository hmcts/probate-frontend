import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class UniqueProbateCodePage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyUniqueProbateCode;
  private readonly nextPageUrl = ROUTES.intestacyProbateEstateValues;

  async enterUniqueProbateCodeAndContinue(code: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.getInputById('uniqueProbateCodeId').fill(code);
    await this.clickSaveAndContinue(this.nextPageUrl);
  }
}
