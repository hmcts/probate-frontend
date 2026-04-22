import { BasePage } from '../../base/BasePage';

export class CertificateInterimPage extends BasePage {
  private readonly pageUrl = /\/intestacy\/certificate-interim$/;
  private readonly nextPageUrl = /\/intestacy\/calc-check$/;

  async selectDeathCertificate(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'deathCertificate',
      this.nextPageUrl,
      'Save and continue',
    );
  }
}
