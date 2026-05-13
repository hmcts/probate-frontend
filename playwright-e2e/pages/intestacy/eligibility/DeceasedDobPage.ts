import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class DeceasedDobPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyDeceasedDob;
  private readonly nextPageUrl = ROUTES.intestacyDeceasedDod;

  async fillDobAndContinue(day: string, month: string, year: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.fillDateByIdPrefix('dob-date', day, month, year);
    await this.clickSaveAndContinue(this.nextPageUrl);
  }
}
