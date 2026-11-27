import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class ApplicantNamePage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyApplicantName;
  private readonly nextPageUrl = ROUTES.intestacyApplicantPhone;

  async enterApplicantName(firstName: string, lastName: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    await this.getInputById('firstName').fill(firstName);
    await this.getInputById('lastName').fill(lastName);

    await this.clickSaveAndContinue(this.nextPageUrl);
  }
}
