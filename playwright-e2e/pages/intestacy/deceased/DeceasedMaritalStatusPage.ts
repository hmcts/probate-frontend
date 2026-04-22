import { BasePage } from '../../base/BasePage';

export class DeceasedMaritalStatusPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/deceased-marital-status$/;

  async selectMarried(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue('maritalStatus', undefined, 'Save and continue');
  }
}
