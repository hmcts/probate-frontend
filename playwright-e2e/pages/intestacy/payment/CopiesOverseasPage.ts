import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class CopiesOverseasPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyCopiesOverseas;
  private readonly nextPageUrl = ROUTES.intestacyCopiesSummary;

  async enterExtraCertifiedCopiesAndContinue(copies: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    await this.getInputById('overseas').fill(copies);

    await this.clickSaveAndContinue(this.nextPageUrl);
  }
}
