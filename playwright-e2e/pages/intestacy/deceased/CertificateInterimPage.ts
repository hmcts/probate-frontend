import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';
import { ROUTES } from '../../../constants/routes';

export class CertificateInterimPage extends BasePage {
  private readonly pageUrl = ROUTES.intestacyCertificateInterim;
  private readonly nextPageUrl = ROUTES.intestacyCalcCheck;

  async selectDeathCertificate(): Promise<void> {
  await this.waitForPageUrl(this.pageUrl);
  await this.selectRadioByIdAndContinue('deathCertificate', this.nextPageUrl, 'Save and continue');
}

async selectInterimDeathCertificate(): Promise<void> {
  await this.waitForPageUrl(this.pageUrl);
  await this.selectRadioByIdAndContinue('deathCertificate-2', this.nextPageUrl, 'Save and continue');
}

async selectCertificate(certificateType: 'death' | 'interim'): Promise<void> {
  if (certificateType === 'death') {
    await this.selectDeathCertificate();
  } else {
    await this.selectInterimDeathCertificate();
  }
}
}
