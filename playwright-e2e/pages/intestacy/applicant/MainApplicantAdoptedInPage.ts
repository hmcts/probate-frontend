import { BasePage } from '../../base/BasePage';

export class MainApplicantAdoptedInPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/main-applicant-adopted-in$/;
  private readonly yesNextPageUrl = /\/intestacy\/adopted-in-england-or-wales$/;
  private readonly noNextPageUrl = /\/intestacy\/main-applicant-adopted-out$/;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'adoptedIn',
      this.yesNextPageUrl,
      'Save and continue',
    );
  }

  async selectNo(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'adoptedIn-2',
      this.noNextPageUrl,
      'Save and continue',
    );
  }
}
