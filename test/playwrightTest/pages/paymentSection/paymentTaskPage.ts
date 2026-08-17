import { BrowserContext, expect } from '@playwright/test';
import {BasePage, decodeHTML} from '../utility/basePage.ts';
import {getContent} from "../utility/contentHelper.ts";
import { testConfig } from "../../configs/config.ts";
import paymentTextConfig from "../../data/paymentText.json" with { type: "json" };

export class PaymentTaskSection extends BasePage {
  readonly saveAndContinueButtonLocator = this.page.getByRole('button', {name: this.commonContent.saveAndContinue});
  readonly saveAndCloseLinkLocator = this.page.getByRole('link', {name: this.commonContent.saveAndClose});
  readonly payAndSubmitButtonLocator = this.page.getByRole('button', {name: this.commonContent.payAndSubmitApplication});
  readonly submitButtonLocator = this.page.getByRole('button', {name: this.commonContent.submitApplication});
  readonly continueButtonLocator = this.page.getByRole('button', {name: this.commonContent.continue});
  readonly confirmButtonLocator = this.page.getByRole('button', {name: this.commonContent.confirmPayment});
  readonly cancelPaymentButtonLocator = this.page.locator('#cancel-payment');
  readonly signOutLinkLocator = this.page.getByRole('link', {name: this.commonContent.signOut});
  readonly cyaDownloadLocator = this.page.locator('#checkAnswerHref');
  readonly legalStatementDownloadLocator = this.page.locator('#declarationPdfHref');
  readonly coverSheetDownloadLocator = this.page.locator('#coverSheetPdfHref');

  constructor(page, context: BrowserContext, language: string) {
    super(page, context, language);
  }

  async enterUkCopies(language = 'en', copies = null) {
    const ukCopiesContent = getContent(`app/resources/${language}/translation/copies/uk.json`);
    await this.checkInUrl('/copies-uk');
    await expect(this.page.getByText(await decodeHTML(ukCopiesContent.question))).toBeVisible();
    await expect(this.page.locator('#uk')).toBeEnabled();
    await this.page.locator('#uk').fill(copies);
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async enterOverseasCopies(copies = null) {
    await this.checkInUrl('/copies-overseas');
    await expect(this.page.locator('#overseas')).toBeEnabled();
    await this.page.locator('#overseas').fill(copies);
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async selectOverseasAssets(answer = null) {
    await this.checkInUrl('/assets-overseas');
    await expect(this.page.locator(`#assetsoverseas${answer}`)).toBeEnabled();
    await this.page.locator(`#assetsoverseas${answer}`).click();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async seeCopiesSummary(language ='en') {
    const summaryContent = getContent(`app/resources/${language}/translation/copies/summary.json`);
    await this.checkInUrl('/copies-summary');
    await expect(this.page.getByText(await decodeHTML(summaryContent.extraCopies))).toBeVisible();
    await expect(this.saveAndContinueButtonLocator).toBeEnabled();
    await this.navByClick(this.saveAndContinueButtonLocator);
  }

  async seePaymentBreakdownPage(language = 'en', paymentNeeded = true) {
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

  async seeGovUkPaymentPage(language = 'en') {
    const heading = language === 'en'
        ? 'Enter card details'
        : 'Rhowch fanylion y cerdyn';

    await expect(this.page.getByRole('heading', { name: heading })).toBeVisible();
    await expect(this.page.getByLabel(/Card number|Rhif cerdyn/)).toBeVisible();

    await this.page.getByLabel(/Card number|Rhif cerdyn/).fill(testConfig.govPayTestCardNos.validCardNo);
    await this.page.getByLabel(/Month|Mis/).fill(testConfig.govPayTestCardDetails.expiryMonth);
    await this.page.getByLabel(/Year|Blwyddyn/).fill(testConfig.govPayTestCardDetails.expiryYear);
    await this.page.getByLabel(/Name on card|Enw ar y cerdyn/).fill(testConfig.govPayTestCardDetails.cardholderName);
    await this.page.getByLabel(/Card security code|Cod diogelwch y cerdyn/).fill(testConfig.govPayTestCardDetails.cvc);
    await this.page.getByLabel(/Address line 1|Llinell cyfeiriad 1/).fill(testConfig.govPayTestCardDetails.addressLine1);
    await this.page.getByLabel(/Town or city|Tref neu ddinas/).fill(testConfig.govPayTestCardDetails.addressCity);
    await this.page.getByLabel(/Postcode|Cod post/).fill(testConfig.govPayTestCardDetails.addressPostcode);
    await this.page.getByLabel(/Email|E-bost/).fill(testConfig.TestEnvEmailAddress);

    const continueBtn = this.page.getByRole('button', { name: language === 'en' ? 'Continue' : 'Parhau' });
    await expect(continueBtn).toBeVisible();
    await expect(continueBtn).toBeEnabled();

    // First click
    await continueBtn.click();
    await this.page.waitForTimeout(3000);

    // If still on the card page (by title), click again once
    const titleAfterFirstClick = await this.page.title();
    const isStillCardPage =
        (language === 'en' && titleAfterFirstClick === 'Enter payment details') ||
        (language === 'cy' && titleAfterFirstClick === 'Rhowch fanylion taliad');

    if (isStillCardPage) {
      console.log(`[RETRY CONTINUE] language=${language} still on card page, clicking again`);
      await continueBtn.click();
      await this.page.waitForTimeout(2000);
    }

    // Now wait for navigation to /confirm or at least some change
    try {
      await this.page.waitForURL(/\/card_details\/[^/]+\/confirm$/, { timeout: 60000 });
    } catch {
      // If we didn't reach /confirm, just ensure we're still on the payment domain
      await expect(this.page).toHaveURL(/card\.payments\.service\.gov\.uk/);
    }

    const url = this.page.url();
    const title = await this.page.title();
    console.log(`[AFTER CONTINUE] language=${language} url=${url} title=${title}`);
  }

  async seeGovUkConfirmPage(language = 'en') {
    const langKey = language.charAt(0).toUpperCase() + language.slice(1);
    const expectedHeading = paymentTextConfig[`paymentHeading${langKey}`];
    const confirmButtonName = language === 'en' ? 'Confirm payment' : 'Cadarnhau’r taliad';

    const url = this.page.url();
    const title = await this.page.title();
    console.log(`[CONFIRM PAGE] language=${language} url=${url} title=${title}`);

    await expect(this.page).toHaveURL(/card\.payments\.service\.gov\.uk/);

    // If we are on /confirm, assert the confirm heading/button directly
    if (url.includes('/confirm')) {
      await expect(this.page.getByRole('heading', { name: expectedHeading })).toBeVisible({ timeout: 60000 });
    } else {
      // Still on card domain but not /confirm:
      // wait for the confirm heading to appear (page may have transitioned without URL change)
      await expect(this.page.getByRole('heading', { name: expectedHeading })).toBeVisible({ timeout: 60000 });
    }

    const confirmButton = this.page.getByRole('button', { name: new RegExp(confirmButtonName, 'i') });
    await expect(confirmButton).toBeVisible({ timeout: 60000 });

    await confirmButton.click();
  }

  async seeGovUkCancelPage(language ='en') {
    const langKey = language.charAt(0).toUpperCase() + language.slice(1);
    await expect(this.page.getByRole('heading', { name: paymentTextConfig[`paymentHeading${langKey}`] })).toBeVisible();
    await this.navByClick(this.cancelPaymentButtonLocator);
  }

  async seeCancellationPage(language ='en') {
    const langKey = language.charAt(0).toUpperCase() + language.slice(1);
    await expect(this.page.getByRole('heading', { name: paymentTextConfig[`paymentCancelledContent${langKey}`] })).toBeVisible();
    await this.navByClick(this.page.locator('#return-url'));
  }

  async seePaymentClosePage(language = 'en') {
    const paymentContent = getContent(`app/resources/${language}/translation/payment/breakdown.json`);
    await this.checkInUrl('/payment-breakdown');
    await expect(this.page.getByText(decodeHTML(paymentContent.applicationFee))).toBeVisible();
    await this.navByClick(this.saveAndCloseLinkLocator);
    await this.navByClick(this.signOutLinkLocator);
  }

  async seeThankYouPage(language = 'en', testSurvey: boolean = false, isWithoutDocs: boolean = false) {
    const thankYouContent = getContent(`app/resources/${language}/translation/thankyou.json`);
    await this.checkInUrl('/thank-you');
    await expect(this.page.getByText(await decodeHTML(thankYouContent.header))).toBeVisible();
    const confirmationText = await this.page.locator('#main-content > div > div > div.govuk-panel.govuk-panel--confirmation > div')
      .innerText();
    const caseId = confirmationText.match(/\d+(-\d+)+/);
    await this.downloadPdfIfNotIE11(this.cyaDownloadLocator);
    if(!isWithoutDocs) {
      await this.downloadPdfIfNotIE11(this.coverSheetDownloadLocator)
    }
    await this.downloadPdfIfNotIE11(this.legalStatementDownloadLocator);

    if (testSurvey) {
      const originalTabs = await this.context.pages().length;
      await this.page.locator('#main-content > div > div > div.govuk-notification-banner > div > p.govuk-body > a').click();
      for (let i = 0; i <= 5; i++) {
        // eslint-disable-next-line no-await-in-loop
        const currentTabs = await this.context.pages().length;
        if (currentTabs > originalTabs) {
          break;
        }
        // eslint-disable-next-line no-await-in-loop
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
