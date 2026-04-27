import { expect } from '@playwright/test';
import { BasePage } from '../../base/BasePage';

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
  private readonly pageUrl = /card\.payments\.service\.gov\.uk\/card_details\/.+/;

  async fillCardDetailsAndContinue(details: PaymentDetails): Promise<void> {
    await this.waitForPageUrl(this.pageUrl);

    await this.getInputById('card-no').fill(details.cardNumber);
    await this.getInputById('expiry-month').fill(details.expiryMonth);
    await this.getInputById('expiry-year').fill(details.expiryYear);
    await this.getInputById('cardholder-name').fill(details.cardholderName);
    await this.getInputById('cvc').fill(details.cvc);
    await this.getInputById('address-line-1').fill(details.address.line1);
    await this.getInputById('address-line-2').fill(details.address.line2);
    await this.getInputById('address-city').fill(details.address.city);
    await this.getInputById('address-country').fill(details.address.country);
    await this.getInputById('address-postcode').fill(details.address.postcode);
    await this.getInputById('email').fill(details.email);

    const continueButton = this.page.getByRole('button', { name: 'Continue' });
    await expect(continueButton).toBeVisible();
    await continueButton.click();
  }
}
