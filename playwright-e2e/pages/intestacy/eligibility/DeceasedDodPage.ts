import { BasePage } from '../../base/BasePage';

export class DeceasedDodPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/deceased-dod$/;
  private readonly nextPageUrl = /\/intestacy\/deceased-address$/;

  async fillDodAndContinue(day: string, month: string, year: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.getInputById('dod-date-day').fill(day);
    await this.getInputById('dod-date-month').fill(month);
    await this.getInputById('dod-date-year').fill(year);
    await this.clickSaveAndContinue(this.nextPageUrl);
  }
}
