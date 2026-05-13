import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class DeceasedDodPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyDeceasedDod;
  private readonly nextPageUrl = ROUTES.intestacyDeceasedAddress;

  async fillDodAndContinue(day: string, month: string, year: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.fillDateByIdPrefix('dod-date', day, month, year);
    await this.clickSaveAndContinue(this.nextPageUrl);
  }
}
