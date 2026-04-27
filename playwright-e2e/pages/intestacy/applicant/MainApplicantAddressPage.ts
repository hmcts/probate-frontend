import { expect, Page } from '@playwright/test';
import { DeceasedAddressPage } from '../deceased/DeceasedAddressPage';

export class MainApplicantAddressPage extends DeceasedAddressPage {
  protected readonly pageUrl = /\/intestacy\/applicant-address$/;
  

  async enterManualAddressAndContinue(
    addressLine1: string,
    addressLine2: string,
    addressLine3: string,
    town: string,
    postcode: string,
    country: string,
    nextPageUrl?: RegExp,
  ): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    const detailsSummary = this.page
      .locator('summary.govuk-details__summary')
      .filter({ has: this.page.getByText('Enter an address instead', { exact: true }) });

    await expect(detailsSummary).toHaveCount(1);
    await detailsSummary.click();

    await this.getInputById('addressLine1').waitFor({ state: 'visible' });

    await this.getInputById('addressLine1').fill(addressLine1);
    await this.getInputById('addressLine2').fill(addressLine2);
    await this.getInputById('addressLine3').fill(addressLine3);
    await this.getInputById('postTown').fill(town);
    await this.getInputById('newPostCode').fill(postcode);
    await this.getInputById('country').fill(country);

    await this.clickSaveAndContinue(nextPageUrl);
  }
}
