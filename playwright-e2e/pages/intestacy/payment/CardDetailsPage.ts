import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage.ts';
import { ROUTES } from '../../../constants/routes.ts';

type PaymentDetails = {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cardholderName: string;
  cvc: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    country: string;
    postcode: string;
  };
  email: string;
};

export class CardDetailsPage extends BasePage {
  private readonly pageUrl = ROUTES.cardDetails;
  private readonly nextPageUrl = ROUTES.cardConfirm;

  async fillCardDetailsAndContinue(details: PaymentDetails): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    await expect(this.getInputById('card-no')).toBeVisible();

    await this.getInputById('card-no').fill(details.cardNumber);
    await this.getInputById('expiry-month').fill(details.expiryMonth);
    await this.getInputById('expiry-year').fill(details.expiryYear);
    await this.getInputById('cardholder-name').fill(details.cardholderName);
    await this.getInputById('cvc').fill(details.cvc);

    await this.getInputById('address-line-1').fill(details.address.line1);
    await this.getInputById('address-line-2').fill(details.address.line2);
    await this.getInputById('address-city').fill(details.address.city);

    await this.selectCountry(details.address.country);

    await this.getInputById('address-postcode').fill(details.address.postcode);
    await this.getInputById('email').fill(details.email);

    const continueButton = this.page.locator('#submit-card-details');
    await expect(continueButton).toBeVisible();
    await expect(continueButton).toBeEnabled();

    await continueButton.click();
    await this.page.waitForLoadState('domcontentloaded');

    const currentUrl = this.page.url();

    if (!this.nextPageUrl.test(currentUrl)) {
      const errorSummary = this.page.locator('.govuk-error-summary');
      const fieldError = this.page.locator('.govuk-error-message');

      if (await errorSummary.isVisible().catch(() => false)) {
        throw new Error(`Card details validation failed. Still on: ${currentUrl}`);
      }

      if (await fieldError.first().isVisible().catch(() => false)) {
        throw new Error(`Card field validation failed. Still on: ${currentUrl}`);
      }

      await expect(this.page).toHaveURL(this.nextPageUrl);
    }
  }

  private async selectCountry(country: string): Promise<void> {
    const countryField = this.page.locator('#address-country');
    await expect(countryField).toBeVisible();

    try {
      await countryField.selectOption({ label: country });
      return;
    } catch {
      await countryField.fill(country);

      const option = this.page
        .getByRole('option', { name: country, exact: true })
        .first();

      await expect(option).toBeVisible();
      await option.click();
      await expect(countryField).toHaveValue(country);
    }
  }
}
