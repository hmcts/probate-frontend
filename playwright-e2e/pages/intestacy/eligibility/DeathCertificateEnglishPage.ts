import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class DeathCertificateEnglishPage extends BasePage {
  private readonly pageUrl = ROUTES.deathCertificateEnglish;
  private readonly nextPageUrl = ROUTES.deceasedDomicile;

  async selectYes(): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(
      'deathCertificateInEnglish',
      this.nextPageUrl,
      'Continue',
    );
  }

  async selectNo(): Promise<void> {
  await this.waitForPageUrl(this.pageUrl);
  await this.selectRadioByIdAndContinue(
    'deathCertificateInEnglish-2',
    this.nextPageUrl,
    'Continue',
  );
  }
}
