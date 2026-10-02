import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

export class DeathCertificatePage extends BasePage {
  private readonly pageUrl = ROUTES.deathCertificate;
  private readonly nextPageUrl = ROUTES.deathCertificateEnglish;

  private async selectOptionAndContinue(radioId: string): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);
    await this.selectRadioByIdAndContinue(radioId, this.nextPageUrl, 'Continue');
  }

  async selectYes(): Promise<void> {
    await this.selectOptionAndContinue('deathCertificate');
  }

  async selectNo(): Promise<void> {
    await this.selectOptionAndContinue('deathCertificate-2');
  }
}
