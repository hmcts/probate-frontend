import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class ApplicantPhonePage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyApplicantPhone;
  private readonly nextPageUrl = ROUTES.intestacyApplicantAddress;

  async enterApplicantPhoneNumber(phoneNumber: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.page.locator('#phoneNumber').fill(phoneNumber);
    await this.page.getByRole('button', { name: 'Save and continue' }).click();
    await this.page.waitForURL(this.nextPageUrl, { waitUntil: 'domcontentloaded' });
  }
}
