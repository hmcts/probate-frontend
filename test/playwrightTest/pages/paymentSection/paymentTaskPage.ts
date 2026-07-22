import { BrowserContext, expect, Page } from '@playwright/test';
import { BasePage, decodeHTML } from '../utility/basePage.js';
import { getContent } from '../utility/contentHelper.js';
import { testConfig } from '../../configs/config.js';
import paymentTextConfig from '../../data/paymentText.json' with { type: 'json' };

export class PaymentTaskSection extends BasePage {
  readonly saveAndContinueButtonLocator = this.page.getByRole('button', { name: this.commonContent.saveAndContinue });
  readonly saveAndCloseLinkLocator = this.page.getByRole('link', { name: this.commonContent.saveAndClose });
  readonly payAndSubmitButtonLocator = this.page.getByRole('button', { name: this.commonContent.payAndSubmitApplication });
  readonly submitButtonLocator = this.page.getByRole('button', { name: this.commonContent.submitApplication });
  readonly cancelPaymentButtonLocator = this.page.locator('#cancel-payment');
  readonly signOutLinkLocator = this.page.getByRole('link', { name: this.commonContent.signOut });
  readonly cyaDownloadLocator = this.page.locator('#checkAnswerHref');
  readonly legalStatementDownloadLocator = this.page.locator('#declarationPdfHref');
  readonly coverSheetDownloadLocator = this.page.locator('#coverSheetPdfHref');

  constructor(page: Page, context: BrowserContext, language: string) {
    super(page, context, language);
  }

  async enterUkCopies(language = 'en', copies: string | null = null): Promise<void> {
    const ukCopiesContent = getContent(`app/resources/${language}/translation/copies/uk.json`);
    await this.checkInUrl('/copies-uk');
    await expect(this.page.getByText(await decodeHTML(ukCopiesContent.question))).toBeVisible();
    await expect(this.page.locator('#uk')).toBeEnabled();
    await this.page.locator('#uk').fill(copies ?? '');
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterOverseasCopies(copies: string | null = null): Promise<void> {
    await this.checkInUrl('/copies-overseas');
    await expect(this.page.locator('#overseas')).toBeEnabled();
    await this.page.locator('#overseas').fill(copies ?? '');
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectOverseasAssets(answer: string | null = null): Promise<void> {
    await this.checkInUrl('/assets-overseas');
    await expect(this.page.locator(`#assetsoverseas${answer}`)).toBeEnabled();
    await this.page.locator(`#assetsoverseas${answer}`).check();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async seeCopiesSummary(language = 'en'): Promise<void> {
    const summaryContent = getContent(`app/resources/${language}/translation/copies/summary.json`);
    await this.checkInUrl('/copies-summary');
    await expect(this.page.getByText(await decodeHTML(summaryContent.extraCopies))).toBeVisible();
    await expect(this.saveAndContinueButtonLocator).toBeEnabled();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async seePaymentBreakdownPage(language = 'en', paymentNeeded = true): Promise<void> {
    const paymentContent = getContent(`app/resources/${language}/translation/payment/breakdown.json`);
    await this.checkInUrl('/payment-breakdown');
    await expect(this.page.getByText(await decodeHTML(paymentContent.applicationFee))).toBeVisible();

    if (paymentNeeded) {
      await expect(this.payAndSubmitButtonLocator).toBeVisible();
      await expect(this.payAndSubmitButtonLocator).toBeEnabled();
      await this.navByClick(this.payAndSubmitButtonLocator);
    } else {
      await expect(this.submitButtonLocator).toBeVisible();
      await expect(this.submitButtonLocator).toBeEnabled();
      await this.navByClick(this.submitButtonLocator);
    }
  }

  private async setGovUkPayCountry(country = 'United Kingdom'): Promise<void> {
    const countrySelect = this.page.locator('select#address-country');
    const countryInput = this.page.locator('input#address-country');

    if (await countrySelect.count()) {
      await expect(countrySelect).toBeVisible();
      await expect(countrySelect).toBeEnabled();
      await countrySelect.selectOption({ label: country });
      return;
    }

    if (await countryInput.count()) {
      await expect(countryInput).toBeVisible();
      await expect(countryInput).toBeEnabled();
      await countryInput.fill(country);

      const option = this.page.getByRole('option', { name: new RegExp(country, 'i') }).first();
      if (await option.count()) {
        await option.click().catch(() => undefined);
      } else {
        await countryInput.press('ArrowDown').catch(() => undefined);
        await countryInput.press('Enter').catch(() => undefined);
      }

      return;
    }
  }

  async seeGovUkPaymentPage(language = 'en'): Promise<void> {
    await expect(this.page).toHaveURL(/\/card_details\/[^/?]+(?:\?.*)?$/, { timeout: 60_000 });

    const cardNo = this.page.locator('#card-no');
    const expiryMonth = this.page.locator('#expiry-month');
    const expiryYear = this.page.locator('#expiry-year');
    const cardholderName = this.page.locator('#cardholder-name');
    const cvc = this.page.locator('#cvc');
    const addressLine1 = this.page.locator('#address-line-1');
    const addressCity = this.page.locator('#address-city');
    const addressPostcode = this.page.locator('#address-postcode');
    const emailField = this.page.locator('#email');
    const govUkPayContinueButton = this.page.locator('#submit-card-details');

    await expect(cardNo).toBeVisible({ timeout: 60_000 });
    await expect(expiryMonth).toBeVisible();
    await expect(expiryYear).toBeVisible();
    await expect(cardholderName).toBeVisible();
    await expect(cvc).toBeVisible();
    await expect(govUkPayContinueButton).toBeVisible();
    await expect(govUkPayContinueButton).toBeEnabled();

    await cardNo.fill(testConfig.govPayTestCardNos.validCardNo);
    await expiryMonth.fill(testConfig.govPayTestCardDetails.expiryMonth);
    await expiryYear.fill(testConfig.govPayTestCardDetails.expiryYear);
    await cardholderName.fill(testConfig.govPayTestCardDetails.cardholderName);
    await cvc.fill(testConfig.govPayTestCardDetails.cvc);

    await addressLine1.fill(testConfig.govPayTestCardDetails.addressLine1);
    await addressCity.fill(testConfig.govPayTestCardDetails.addressCity);
    await this.setGovUkPayCountry('United Kingdom');
    await addressPostcode.fill(testConfig.govPayTestCardDetails.addressPostcode);

    if (await emailField.count()) {
      await emailField.fill(testConfig.TestEnvEmailAddress);
    }

    await expect(cardNo).toHaveValue(testConfig.govPayTestCardNos.validCardNo);
    await expect(expiryMonth).toHaveValue(testConfig.govPayTestCardDetails.expiryMonth);
    await expect(expiryYear).toHaveValue(testConfig.govPayTestCardDetails.expiryYear);
    await expect(cardholderName).toHaveValue(testConfig.govPayTestCardDetails.cardholderName);
    await expect(cvc).toHaveValue(testConfig.govPayTestCardDetails.cvc);
    await expect(addressLine1).toHaveValue(testConfig.govPayTestCardDetails.addressLine1);
    await expect(addressCity).toHaveValue(testConfig.govPayTestCardDetails.addressCity);
    await expect(addressPostcode).toHaveValue(testConfig.govPayTestCardDetails.addressPostcode);

    const countrySelect = this.page.locator('select#address-country');
    const countryInput = this.page.locator('input#address-country');

    if (await countrySelect.count()) {
      await expect(countrySelect).toHaveValue(/.+/);
    }

    if (await countryInput.count()) {
      const countryValue = await countryInput.inputValue();
      console.log('country input value before submit:', countryValue);
      await expect(countryInput).toHaveValue(/United Kingdom/i);
    }

    if (await emailField.count()) {
      await expect(emailField).toHaveValue(testConfig.TestEnvEmailAddress);
      await emailField.focus();
      await emailField.press('Tab').catch(() => undefined);
      await emailField.blur().catch(() => undefined);
    } else {
      await addressPostcode.focus();
      await addressPostcode.press('Tab').catch(() => undefined);
      await addressPostcode.blur().catch(() => undefined);
    }

    await expect(govUkPayContinueButton).toBeVisible();
    await expect(govUkPayContinueButton).toBeEnabled();

    await govUkPayContinueButton.click();

    try {
      await expect(this.page).toHaveURL(/\/confirm(?:\?.*)?$/, { timeout: 60_000 });
    } catch (error) {
      const errorSummary = this.page.locator('.govuk-error-summary');
      const errorLinks = this.page.locator('.govuk-error-summary a');
      const inlineErrors = this.page.locator('.govuk-error-message');
      const invalidFields = this.page.locator('[aria-invalid="true"]');

      if (await errorSummary.count()) {
        console.log(
          'GOV.UK Pay error summary:',
          await errorSummary.first().innerText().catch(() => 'unable to read error summary')
        );
      }

      if (await errorLinks.count()) {
        console.log(
          'GOV.UK Pay error links:',
          await errorLinks.allInnerTexts().catch(() => [])
        );
      }

      if (await inlineErrors.count()) {
        console.log(
          'GOV.UK Pay inline errors:',
          await inlineErrors.allInnerTexts().catch(() => [])
        );
      }

      if (await invalidFields.count()) {
        const invalidFieldDetails = await invalidFields.evaluateAll((elements) =>
          elements.map((el) => ({
            id: el.getAttribute('id'),
            name: el.getAttribute('name'),
            tag: el.tagName,
            ariaLabel: el.getAttribute('aria-label'),
            describedBy: el.getAttribute('aria-describedby'),
            value: (el as HTMLInputElement).value ?? ''
          }))
        );
        console.log('GOV.UK Pay invalid fields:', invalidFieldDetails);
      }

      console.log('Current URL after submit:', this.page.url());
      throw error;
    }
  }

  async seeGovUkConfirmPage(language = 'en'): Promise<void> {
    await expect(this.page).toHaveURL(/\/confirm(?:\?.*)?$/, { timeout: 60_000 });

    await expect(this.page.locator('#confirm')).toBeVisible({ timeout: 60_000 });
    await expect(this.page.locator('#confirm')).toBeEnabled();

    const confirmHeading = this.page
      .getByRole('heading', { name: /Confirm your payment|Cadarnhau eich taliad/i })
      .or(this.page.getByText(/Confirm your payment|Cadarnhau eich taliad|Cadarnhau/i))
      .first();

    if (await confirmHeading.count()) {
      await expect(confirmHeading).toBeVisible({ timeout: 60_000 });
    }

    await this.navByClick(this.page.locator('#confirm'));
  }

  async seeGovUkCancelPage(language = 'en'): Promise<void> {
    const langKey = language.charAt(0).toUpperCase() + language.slice(1);
    await expect(
      this.page.getByRole('heading', { name: paymentTextConfig[`paymentHeading${langKey}`] })
    ).toBeVisible();
    await this.navByClick(this.cancelPaymentButtonLocator);
  }

  async seeCancellationPage(language = 'en'): Promise<void> {
    const langKey = language.charAt(0).toUpperCase() + language.slice(1);
    await expect(
      this.page.getByRole('heading', { name: paymentTextConfig[`paymentCancelledContent${langKey}`] })
    ).toBeVisible();
    await this.navByClick(this.page.locator('#return-url'));
  }

  async seePaymentClosePage(language = 'en'): Promise<void> {
    const paymentContent = getContent(`app/resources/${language}/translation/payment/breakdown.json`);
    await this.checkInUrl('/payment-breakdown');
    await expect(this.page.getByText(await decodeHTML(paymentContent.applicationFee))).toBeVisible();
    await this.navByClick(this.saveAndCloseLinkLocator);
    await this.navByClick(this.signOutLinkLocator);
  }

  async seeThankYouPage(language = 'en', testSurvey: boolean = false, isWithoutDocs: boolean = false): Promise<string> {
    const thankYouContent = getContent(`app/resources/${language}/translation/thankyou.json`);
    await this.checkInUrl('/thank-you');
    await expect(this.page.getByText(await decodeHTML(thankYouContent.header))).toBeVisible();

    const confirmationText = await this.page
      .locator('#main-content > div > div > div.govuk-panel.govuk-panel--confirmation > div')
      .innerText();

    const caseId = confirmationText.match(/\d+(-\d+)+/);

    await this.downloadPdfIfNotIE11(this.cyaDownloadLocator);
    if (!isWithoutDocs) {
      await this.downloadPdfIfNotIE11(this.coverSheetDownloadLocator);
    }
    await this.downloadPdfIfNotIE11(this.legalStatementDownloadLocator);

    if (testSurvey) {
      const originalTabs = await this.context.pages().length;
      await this.page.locator('#main-content > div > div > div.govuk-notification-banner > div > p.govuk-body > a').click();

      for (let i = 0; i <= 5; i++) {
        const currentTabs = await this.context.pages().length;
        if (currentTabs > originalTabs) {
          break;
        }
        await this.page.waitForTimeout(200);
      }

      await this.switchToNextTab(1);
      const activeTab = await this.closeCurrentTab();
      await activeTab.waitForTimeout(200);
    }

    await expect(this.page.locator('#navigation > li:nth-child(2) > a')).toBeEnabled();
    await this.navByClick(this.page.locator('#navigation > li:nth-child(2) > a'));

    return caseId ? caseId[0].trim() : '';
  }
}
