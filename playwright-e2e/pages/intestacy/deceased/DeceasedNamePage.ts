import { BasePage } from '../../base/BasePage';

export class DeceasedNamePage extends BasePage {
  private readonly pageUrl = /\/intestacy\/deceased-name$/;
  private readonly nextPageUrl = /\/intestacy\/deceased-dob$/;

  async fillDeceasedNameAndContinue(firstName: string, lastName: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.getInputById('firstName').fill(firstName);
    await this.getInputById('lastName').fill(lastName);
    await this.clickSaveAndContinue();
  }
}
