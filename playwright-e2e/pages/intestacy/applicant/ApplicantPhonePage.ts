import { BasePage } from '../../base/BasePage';

export class ApplicantPhonePage extends BasePage {
  private readonly pageUrl = /\/intestacy\/applicant-phone$/;
  private readonly nextPageUrl = /\/intestacy\/applicant-address$/;

  async enterPhoneNumber(phoneNumber: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    await this.getInputById('phoneNumber').fill(phoneNumber);

    await this.clickSaveAndContinue(this.nextPageUrl);
  }
}
