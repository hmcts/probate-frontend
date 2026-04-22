import { BasePage } from '../../base/BasePage';

export class DeathCertificateEnglishPage extends BasePage {
  private readonly pageUrl = /\/death-certificate-english/;
  private readonly nextPageUrl = /\/deceased-domicile/;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'deathCertificateInEnglish',
      this.nextPageUrl,
      'Continue',
    );
  }
}
