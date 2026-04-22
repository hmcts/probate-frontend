import { BasePage } from '../../base/BasePage';

export class DeceasedDobPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/deceased-dob$/;
  private readonly nextPageUrl = /\/intestacy\/deceased-dod$/;

  async fillDobAndContinue(day: string, month: string, year: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.getInputById('dob-date-day').fill(day);
    await this.getInputById('dob-date-month').fill(month);
    await this.getInputById('dob-date-year').fill(year);
    await this.clickSaveAndContinue(this.nextPageUrl);
  }
}
