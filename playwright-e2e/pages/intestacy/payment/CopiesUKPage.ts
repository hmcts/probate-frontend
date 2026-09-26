import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class CopiesUkPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyCopiesUk;
  private readonly nextPageUrl = ROUTES.intestacyAssetsOverseas;

  async enterExtraOfficialCopiesAndContinue(copies: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    await this.getInputById('uk').fill(copies);

    await this.clickSaveAndContinue(this.nextPageUrl);
  }
}
