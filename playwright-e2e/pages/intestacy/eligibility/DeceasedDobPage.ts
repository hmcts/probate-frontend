import { BasePage } from '../../base/BasePage';

export class DeceasedDobPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/deceased-dob$/;
  private readonly nextPageUrl = /\/intestacy\/deceased-dod$/;

  async fillDobAndContinue(day: string, month: string, year: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.fillDateByIdPrefix('dob-date', day, month, year);
    await this.clickSaveAndContinue(this.nextPageUrl);
  }
}
