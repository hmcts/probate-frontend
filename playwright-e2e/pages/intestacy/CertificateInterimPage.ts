import { expect, Page } from '@playwright/test';

export class CertificateInterimPage {
  constructor(private readonly page: Page) {}

  async chooseCertificateType(
    type: 'deathCertificate' | 'interimDeathCertificate'
  ): Promise<void> {
    await expect(this.page).toHaveURL(/\/intestacy\/certificate-interim$/);

    const radio =
      type === 'deathCertificate'
        ? this.page.locator('#deathCertificate')
        : this.page.locator('#deathCertificate-2');

    await radio.check();
    await this.page.getByRole('button', { name: 'Save and continue' }).click();

    await expect(this.page).toHaveURL(/\/intestacy\/calc-check$/);
  }
}
