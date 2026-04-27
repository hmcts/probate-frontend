import { BasePage } from '../../base/BasePage';

export class ApplicantNamePage extends BasePage {
  private readonly pageUrl = /\/intestacy\/applicant-name$/;
  private readonly nextPageUrl = /\/intestacy\/applicant-phone$/;

  async enterApplicantName(firstName: string, lastName: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    await this.getInputById('firstName').fill(firstName);
    await this.getInputById('lastName').fill(lastName);

    await this.clickSaveAndContinue(this.nextPageUrl);
  }
}
